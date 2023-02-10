import { UserDocument } from './../../../model/user.schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from './jwt.payload';
import { UserService } from 'src/modules/user/user.service';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpirattion: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }
  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
