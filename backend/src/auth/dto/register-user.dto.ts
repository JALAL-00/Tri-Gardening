import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

// Define a DTO for address to keep things clean
class AddressDto {
  @IsString()
  @IsNotEmpty()
  thana: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber('BD') 
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;

  // We can nest DTOs for complex objects
  @IsNotEmpty()
  address: AddressDto;
}