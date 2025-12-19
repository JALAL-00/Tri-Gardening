import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpsertSettingsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @IsNotEmpty()
  value: any;
}