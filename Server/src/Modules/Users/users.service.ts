import { Injectable } from '@nestjs/common';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UserRepository } from 'src/Database/Repository/user.repository';
import { AuthService } from '../Auth/auth.service';
import { I_User } from 'src/Common/Interfaces/user.interface';
import { I_Request } from 'src/Common/Interfaces/request.interface';
import { Request, Response } from 'express';
import { UpdateAccountDto } from './dto/update.account.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
  async deleteAccount(
    deleteAccountDto: DeleteAccountDto,
    user: I_User,
    req: Request,
    res: Response,
  ) {
    await this.authService.validateAccount(user, deleteAccountDto.password);
    
    try {
      await this.userRepository.deleteUser(user._id!);
      await this.authService.logout(req as I_Request, res);
    } catch (error) {
      throw new Error('An error occurred while trying to delete the account.');
    }
  }
  async updateAccount(body: UpdateAccountDto) {
    // this.userRepository.updateUser()
  }
}
