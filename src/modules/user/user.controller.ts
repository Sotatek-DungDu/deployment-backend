import { UserDocument, UserRole } from './../../model/user.schema';
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
import { UserEmail } from 'shares/decorators/get-user-email.decorator';
import { hasRoles } from 'shares/decorators/role.decorator';
import { DecoratorUploadUserMedia } from 'shares/decorators/user-media.decorator';
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
  async signup(@Body() user: CreateUserDto): Promise<UserDocument> {
    return this.userService.createUser(user);
  }

  @Post('auth/login')
  @ApiOkResponse({ description: 'Login' })
  async login(@Body() loginDTO: loginDto): Promise<ResponseLogin> {
    return this.userService.login(loginDTO);
  }

  @Post('auth/refresh-access-token')
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  @ApiOkResponse({ description: 'Refresh Token' })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseLogin> {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Get('auth/current')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Get Current Information' })
  async currentUser(
    @UserEmail() email: string,
  ): Promise<Partial<UserDocument>> {
    return await this.userService.findUserByEmail(email);
  }

  @Put('user/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Update Current Information' })
  async updateUser(
    @UserEmail() user_id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<Partial<UserDocument>> {
    return await this.userService.UpdateUser(user_id, updateUser);
  }

  @Post('user/upload-media-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @DecoratorUploadUserMedia()
  @ApiOkResponse({ description: 'Update Media Current User' })
  async uploadMediaUser(
    @UserEmail() email: string,
    @UploadedFile() profileImg: Express.Multer.File,
  ) {
    return this.userService.uploadMediaUser(email, profileImg.path);
  }

  @Get('admin/user')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Admin Get All User' })
  async getAllUser(): Promise<any> {
    return await this.userService.getAllUser();
  }
}
