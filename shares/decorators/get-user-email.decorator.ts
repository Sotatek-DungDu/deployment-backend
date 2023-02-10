import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from 'src/modules/auth/strategy/jwt.payload';

export const UserEmail = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization;
      const payload: JwtPayload = jwtDecode(token);
      return payload.email;
    } catch (e) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
    }
  },
);
