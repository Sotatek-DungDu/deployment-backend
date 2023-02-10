import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProject {
  @ApiProperty({
    required: true,
    example: 'Deployment-system',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: '/action' })
  @IsNotEmpty()
  src: string;
}
