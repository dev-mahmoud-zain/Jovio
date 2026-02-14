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

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('delete')
  @UseGuards(AuthenticationGuard)
  async deleteAccount(
    @Body() body: DeleteAccountDto,
    @GetUserCredentials('user') user: User,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // await this.usersService.deleteAccount(body, user, req, res);
  }
  @Put('update')
  @UseGuards(AuthenticationGuard)
  async updateAccount(
    @Body() body: UpdateAccountDto,
    @GetUserCredentials('user') user: User,
  ) {
    console.log(user);
    await this.usersService.updateAccount(body);
  }
}
