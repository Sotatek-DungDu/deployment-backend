import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export const adminSocketMiddleWare =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    // logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      if (payload.role !== 'ADMIN') {
        next(
          new HttpException(
            'METHOD_NOT_ALLOWED',
            HttpStatus.METHOD_NOT_ALLOWED,
          ),
        );
      }
      socket.email = payload.email;
      socket.role = payload.role;
      next();
    } catch {
      next(new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST));
    }
  };

type AuthPayload = {
  email: string;
  role: string;
};
export type SocketWithAuth = Socket & AuthPayload;
