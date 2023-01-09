import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './strategy/jwt.payload';
import { Cache } from 'cache-manager';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  generateAccessToken(payload: JwtPayload): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(
    accessToken: string,
  ): Promise<{ refreshToken: string }> {
    const refreshToken = uuidv4();
    const hashedAccessToken = createHash('sha256')
      .update(accessToken)
      .digest('hex');
    await this.cacheManager.set<string>(
      `${'AUTH_CACHE'}${refreshToken}`,
      hashedAccessToken,
      {
        ttl: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
      },
    );
    return {
      refreshToken: refreshToken,
    };
  }

  async decodeAccessToken(accessToken: string): Promise<JwtPayload | any> {
    return this.jwtService.decode(accessToken);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePassword(newPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }
}
