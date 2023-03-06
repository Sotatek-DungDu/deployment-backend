import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { UniqueValidator } from '../checkunique.decorator';

export class CreateProject {
  @ApiProperty({
    required: true,
    example: 'Deployment-system',
  })
  @Validate(UniqueValidator)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: '/action' })
  @IsNotEmpty()
  @Validate(UniqueValidator)
  src: string;
}
