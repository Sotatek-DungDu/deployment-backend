import {
  HttpException,
  HttpStatus,
  Injectable,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { AuthService } from '../auth/auth.service';
import { RefreshAccessTokenDto } from '../auth/dto/refresh-access-token.dto';
import { ResponseLogin } from '../auth/dto/response-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { Cache } from 'cache-manager';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from 'src/model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService,
  ) {}

  async createUser(user: CreateUserDto): Promise<any> {
    if (await this.checkUserEmailExisted(user.email)) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newUser = new User();

    newUser.email = user.email;
    newUser.password = await this.authService.hashPassword(user.password);
    newUser.role = 'DEV';
    await new this.userModel(newUser).save();
    const { password, ...data } = newUser;

    const accessToken = await this.authService.generateAccessToken({
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = await this.authService.generateRefreshToken(
      accessToken.accessToken,
    );

    return { data, ...accessToken, ...refreshToken };
  }

  async login(loginDTO: loginDto): Promise<ResponseLogin> {
    const user: UserDocument = await this.findUserByEmail(loginDTO.email);

    if (
      (await this.authService.comparePassword(
        loginDTO.password,
        user.password,
      )) == false
    ) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.authService.generateAccessToken({
      email: user.email,
      role: user.role,
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
    const user = await this.userModel.findOne({
      email: email,
    });
    return !!user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('Account Not Found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findUserById(user_id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: user_id });
    if (!user) {
      throw new HttpException('Account Not Found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async UpdateUser(
    user_id: string,
    updateUser: UpdateUserDto,
  ): Promise<Partial<UserDocument>> {
    const updateNewUser = new User();
    updateNewUser.name = updateUser.name;

    await this.userModel.updateOne({ _id: user_id }, updateNewUser);
    const { password, ...rs } = await this.findUserById(user_id);

    return rs;
  }

  async uploadMediaUser(email: string, profileImg: string) {
    return this.userModel.updateOne(
      { email: email },
      { profileImg: profileImg },
    );
  }

  async getAllUser(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }
}
