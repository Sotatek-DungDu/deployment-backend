import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommand {
  @ApiProperty({
    required: true,
    example: 'git pull',
  })
  @IsNotEmpty()
  action: string;

  @ApiProperty({ required: true, example: 'git pull' })
  @IsNotEmpty()
  command: string;
}
