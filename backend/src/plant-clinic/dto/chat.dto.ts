import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class HistoryItem {
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  image?: string; // Base64 string

  @IsUUID()
  @IsOptional()
  sessionId?: string;
}