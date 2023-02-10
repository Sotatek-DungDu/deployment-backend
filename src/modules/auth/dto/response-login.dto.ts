import { User } from 'src/model/user.schema';
import { PartialType } from '@nestjs/swagger';

export class ResponseLogin extends PartialType(User) {
  accessToken: string;
  refreshToken: string;
}
