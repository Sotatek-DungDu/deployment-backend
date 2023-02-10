import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InputCommand {
  @ApiProperty({
    required: true,
    example: '/home/sotatek/workSpace/deployment/project/dragdrop',
  })
  @IsNotEmpty()
  src: string;

  @ApiProperty({ required: true, example: 'ls' })
  @IsNotEmpty()
  command: string;
}
