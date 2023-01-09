import { PartialType } from '@nestjs/swagger';
import { UserEntity } from 'src/model/entities/user.entity';

export class ResponseLogin extends PartialType(UserEntity) {
  accessToken: string;
  refreshToken: string;
}
