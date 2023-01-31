import { PermissionsService } from './permissions.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserID } from 'shares/decorators/get-user-id.decorator';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Permission manage')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('permissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPermissionByUserId(@UserID() user_id: number): Promise<any> {
    return await this.permissionsService.getPermisionByUserId(user_id);
  }
}
