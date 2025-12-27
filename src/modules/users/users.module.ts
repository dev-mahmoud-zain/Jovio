import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule, DatabaseModule } from 'src/common/modules';

@Module({
  imports:[DatabaseModule,CommonModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
