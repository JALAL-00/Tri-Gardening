import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ChatSession } from './chat-session.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: 'CASCADE' })
  session: ChatSession;

  @Column({ type: 'varchar' })
  role: 'user' | 'model';

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null; 

  @CreateDateColumn()
  createdAt: Date;
}