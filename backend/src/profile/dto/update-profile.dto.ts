import { IsEmail, IsOptional, IsString } from 'class-validator';
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  // This will be used after the frontend uploads a picture to /uploads/image
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}