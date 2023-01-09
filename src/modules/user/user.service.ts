import {
  HttpException,
  HttpStatus,
  Injectable,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { RefreshAccessTokenDto } from '../auth/dto/refresh-access-token.dto';
import { ResponseLogin } from '../auth/dto/response-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { Cache } from 'cache-manager';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService,
  ) {}

  async createUser(user: CreateUserDto): Promise<any> {
    if (await this.checkUserEmailExisted(user.email)) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newUser = new UserEntity();

    newUser.email = user.email;
    newUser.password = await this.authService.hashPassword(user.password);

    await this.userRepository.save(newUser);
    const { password, ...data } = newUser;

    const accessToken = await this.authService.generateAccessToken({
      user_id: newUser.user_id,
    });

    const refreshToken = await this.authService.generateRefreshToken(
      accessToken.accessToken,
    );

    return { data, ...accessToken, ...refreshToken };
  }

  async login(loginDTO: loginDto): Promise<ResponseLogin> {
    const user: UserEntity = await this.findUserByEmail(loginDTO.email);

    if (
      (await this.authService.comparePassword(
        loginDTO.password,
        user.password,
      )) == false
    ) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.authService.generateAccessToken({
      user_id: user.user_id,
    });
    const refreshToken = await this.authService.generateRefreshToken(
      accessToken.accessToken,
    );

    return {
      ...accessToken,
      ...refreshToken,
    };
  }

  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseLogin> {
    const { refreshToken, accessToken } = refreshAccessTokenDto;
    console.log('refreshToken', refreshToken);
    console.log('accessToken', accessToken);
    const oldHashAccessToken = await this.cacheManager.get<string>(
      `${'AUTH_CACHE'}${refreshToken}`,
    );
    if (!oldHashAccessToken)
      throw new HttpException('REFRESH_TOKEN_EXPIRED', HttpStatus.BAD_REQUEST);

    const hashAccessToken = createHash('sha256')
      .update(accessToken)
      .digest('hex');
    if (hashAccessToken == oldHashAccessToken) {
      const oldPayload = await this.authService.decodeAccessToken(accessToken);
      delete oldPayload.iat;
      delete oldPayload.exp;
      const newAccessToken = this.authService.generateAccessToken(oldPayload);
      const newRefreshToken = await this.authService.generateRefreshToken(
        newAccessToken.accessToken,
      );
      await this.cacheManager.del(`${'AUTH_CACHE'}${refreshToken}`);
      return {
        ...newAccessToken,
        ...newRefreshToken,
      };
    } else
      throw new HttpException('REFRESH_TOKEN_EXPIRED', HttpStatus.BAD_REQUEST);
  }

  async checkUserEmailExisted(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['email'],
    });
    return !!user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('Account Not Found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserById(user_id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) {
      throw new HttpException('Account Not Found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async UpdateUser(
    user_id: number,
    updateUser: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    const updateNewUser = new UserEntity();
    updateNewUser.name = updateUser.name;
    updateNewUser.location = updateUser.location;
    updateNewUser.birthDate = updateUser.birthDate;
    updateNewUser.bio = updateUser.bio;
    updateNewUser.instagramUrl = updateUser.instagramUrl;
    updateNewUser.linkedinUrl = updateUser.linkedinUrl;
    updateNewUser.facebookUrl = updateUser.facebookUrl;

    await this.userRepository.update(user_id, updateNewUser);
    const { password, ...rs } = await this.findUserById(user_id);

    return rs;
  }

  async uploadMediaUser(user_id: number, profileImg: string) {
    return this.userRepository.update(user_id, { profileImg: profileImg });
  }
}
