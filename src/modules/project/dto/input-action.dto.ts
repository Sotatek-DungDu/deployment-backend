import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InputAction {
  @ApiProperty({
    required: true,
    example: 'git pull',
  })
  @IsNotEmpty()
  action: string;
}
