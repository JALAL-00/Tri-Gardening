import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';

// This is the shape of the Address entity, not the incoming request
class AddressEntityDto {
  thana: string;
  district: string;
  fullAddress: string;
}

export class CreateUserDto {
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
  @IsNotEmpty()
  password: string; // This will be the hashed password

  @IsArray()
  @IsOptional()
  addresses?: AddressEntityDto[];
}