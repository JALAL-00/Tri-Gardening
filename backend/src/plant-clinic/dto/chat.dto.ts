import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class HistoryItem {
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

export class ChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryItem)
  @IsOptional()
  messages?: HistoryItem[];

  @IsString()
  @IsNotEmpty()
  input: string; // The hook sends the current input separately

  @IsString()
  @IsOptional()
  image?: string; // The hook sends the custom body data merged in
}