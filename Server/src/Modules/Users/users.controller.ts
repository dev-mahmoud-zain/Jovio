import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { AuthenticationGuard } from 'src/Common/Guards/Authentication/authentication.guard';
import { GetUserCredentials } from 'src/Common/Decorators/get-user.decorator';
import { User } from 'src/Database/Models/user.model';
import { AuthService } from '../Auth/auth.service';
import { UpdateAccountDto } from './dto/update.account.dto';
import type { I_Request } from 'src/Common/Interfaces/request.interface';
import * as userInterface from 'src/Common/Interfaces/user.interface';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('delete')
  @UseGuards(AuthenticationGuard)
  async deleteAccount(
    @Body() body: DeleteAccountDto,
    @GetUserCredentials('user') user: User,
    @Req() req: I_Request,
    @Res() res: Response,
  ) {
    await this.usersService.deleteAccount(body, user, req, res);
  }
  @Put('update')
  @UseGuards(AuthenticationGuard)
  async updateAccount(
    @Body() body: UpdateAccountDto,
    @GetUserCredentials('user') user: userInterface.I_User,
  ) {
    await this.usersService.updateAccount(body);
  }
}
