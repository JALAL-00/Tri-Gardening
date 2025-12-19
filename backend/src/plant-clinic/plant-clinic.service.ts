import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';
import { ChatDto } from './dto/chat.dto';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PlantClinicService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ChatSession) private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage) private readonly messageRepository: Repository<ChatMessage>,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) throw new InternalServerErrorException('Google API Key is not configured.');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // --- NEW: List all chat sessions for a user ---
  async listSessions(user: User): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  // --- NEW: Get a single chat session with all its messages ---
  async getSession(sessionId: string, user: User): Promise<ChatSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, user: { id: user.id } },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } },
    });
    if (!session) throw new NotFoundException('Chat session not found.');
    return session;
  }

  async generateContentStream(chatDto: ChatDto, user: User): Promise<Readable> {
    const { message, image, sessionId } = chatDto;
    let session: ChatSession;

    // --- Database Logic ---
    if (sessionId) {
      session = await this.getSession(sessionId, user);
    } else {
      // Create a new session. We'll generate a title from the first message.
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      session = this.sessionRepository.create({ user, title, messages: [] });
    }

    // Save user's message to the DB
    const userMessage = this.messageRepository.create({ session, role: 'user', content: message, imageUrl: image }); // Assuming image is a URL now
    session.messages.push(userMessage);
    await this.sessionRepository.save(session);
    // --- End Database Logic ---

    // --- AI Logic ---
    const history = session.messages.slice(0, -1).map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.content }],
    }));
    
    // ... (System instruction, model setup, safety settings as before) ...
    const systemInstruction = `You are an expert botanist named Gardy...`;
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const chat = model.startChat({ history, systemInstruction: { role: "model", parts: [{ text: systemInstruction }] } });

    const promptParts: Part[] = [];
    // ... (logic to add image part if `image` is a base64 string) ...
    promptParts.push({ text: message });

    try {
      const result = await chat.sendMessageStream(promptParts);
      const stream = new Readable({ read() {} });
      let fullResponse = '';

      (async () => {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            fullResponse += chunkText;
            stream.push(chunkText);
          }
        }
        // After stream ends, save the full AI response to the DB
        const modelMessage = this.messageRepository.create({ session, role: 'model', content: fullResponse });
        await this.messageRepository.save(modelMessage);
        
        stream.push(JSON.stringify({ newSessionId: session.id })); // Send the new session ID at the end
        stream.push(null);
      })();

      return stream;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new InternalServerErrorException('Failed to get response from AI assistant.');
    }
  }
}