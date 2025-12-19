import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'varchar' })
  title: string; 

  @OneToMany(() => ChatMessage, (message) => message.session, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;
}