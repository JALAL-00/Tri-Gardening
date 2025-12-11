import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';


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
  password: string; 

  @IsArray()
  @IsOptional()
  addresses?: AddressEntityDto[];
}