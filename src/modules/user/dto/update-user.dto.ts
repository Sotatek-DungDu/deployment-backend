import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  instagramUrl: string;

  @ApiProperty()
  linkedinUrl: string;

  @ApiProperty()
  facebookUrl: string;
}
