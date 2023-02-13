import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InputSocket {
  @ApiProperty({
    required: true,
    example: '63e5b18a088f4c2c840d037a',
  })
  @IsNotEmpty()
  project_id: string;

  @ApiProperty({ required: true, example: 'git pull' })
  @IsNotEmpty()
  action: string;
}
