import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAddressDto {
  @IsString() @IsNotEmpty()
  thana: string;
  @IsString() @IsNotEmpty()
  district: string;
  @IsString() @IsNotEmpty()
  fullAddress: string;
}