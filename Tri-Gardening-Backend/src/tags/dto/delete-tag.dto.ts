import { IsNotEmpty, IsUUID } from 'class-validator';
export class DeleteTagDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}