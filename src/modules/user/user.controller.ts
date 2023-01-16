import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserID } from 'shares/decorators/get-user-id.decorator';
import { hasRoles } from 'shares/decorators/role.decorator';
import { DecoratorUploadUserMedia } from 'shares/decorators/user-media.decorator';
import { UserEntity } from 'src/model/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { RefreshAccessTokenDto } from '../auth/dto/refresh-access-token.dto';
import { ResponseLogin } from '../auth/dto/response-login.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
@ApiTags('User manage')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  @ApiOkResponse({ description: 'Signup' })
  async signup(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(user);
  }

  @Post('auth/login')
  async login(@Body() loginDTO: loginDto): Promise<ResponseLogin> {
    return this.userService.login(loginDTO);
  }

  @Post('auth/refresh-access-token')
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseLogin> {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Get('auth/current')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async currentUser(@UserID() user_id: number): Promise<Partial<UserEntity>> {
    return await this.userService.findUserById(user_id);
  }

  @Put('user/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @UserID() user_id: number,
    @Body() updateUser: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    return await this.userService.UpdateUser(user_id, updateUser);
  }

  @Post('user/upload-media-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @DecoratorUploadUserMedia()
  async uploadMediaUser(
    @UserID() user_id: number,
    @UploadedFile() profileImg: Express.Multer.File,
  ) {
    return this.userService.uploadMediaUser(user_id, profileImg.path);
  }
}
