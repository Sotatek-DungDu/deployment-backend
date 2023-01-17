import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    // logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.user_id = payload.user_id;
      next();
    } catch {
      next(new HttpException('UNAUTHORIZED', HttpStatus.BAD_REQUEST));
    }
  };

type AuthPayload = {
  user_id: number;
};
export type SocketWithAuth = Socket & AuthPayload;
