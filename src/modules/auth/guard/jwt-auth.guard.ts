import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../strategy/jwt.payload';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const superResult = await super.canActivate(context);
    if (!superResult) {
      return false;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      const payload: JwtPayload = jwtDecode(token);
      console.log('payload', payload);
      return true;
    } catch (e) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
    }
  }
}
