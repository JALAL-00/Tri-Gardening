import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';
import { ChatDto } from './dto/chat.dto';
import { Readable } from 'stream';

@Injectable()
export class PlantClinicService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('Google API Key is not configured.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateContentStream(chatDto: ChatDto): Promise<Readable> {
    const { messages, input, image } = chatDto;

    // Convert the frontend's history to the format Gemini expects
    const history = messages?.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role, // Convert 'assistant' role to 'model'
        parts: [{ text: msg.content }],
    })) || [];

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const systemInstruction = `You are an expert botanist and friendly gardening assistant for a company called TriGardening. 
      Your name is "Gardy". Always be helpful, encouraging, and provide scientifically-backed advice. 
      When diagnosing a plant issue from an image, be thorough. Ask clarifying questions if needed. 
      Structure your advice in clear, actionable steps. Use markdown for formatting like lists and bold text. 
      Never recommend products or services from competing companies.`;

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
      systemInstruction: {
        role: "model",
        parts: [{ text: systemInstruction }]
      }
    });

    // Prepare the parts for the current prompt (image and text)
    const promptParts: Part[] = [];

    if (image) {
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        promptParts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }
    }
    
    // Add the user's text input to the prompt
    promptParts.push({ text: input });
    
    try {
      const result = await chat.sendMessageStream(promptParts);
      
      const stream = new Readable({
        async read() {}
      });

      (async () => {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            stream.push(chunkText);
          }
        }
        stream.push(null); // Signal the end of the stream
      })();
      
      return stream;

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new InternalServerErrorException('Failed to get response from AI assistant.');
    }
  }
}