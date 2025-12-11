// src/auth/dto/login-user.dto.ts
import { IsNotEmpty, IsString, IsPhoneNumber, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsPhoneNumber('BD')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;
}