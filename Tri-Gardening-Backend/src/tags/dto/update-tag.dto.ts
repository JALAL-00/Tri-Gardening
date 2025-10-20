import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class UpdateTagDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}