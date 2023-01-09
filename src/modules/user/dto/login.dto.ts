import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @ApiProperty({ required: true, example: 'abc@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'Abcd123' })
  @IsNotEmpty()
  password: string;
}
