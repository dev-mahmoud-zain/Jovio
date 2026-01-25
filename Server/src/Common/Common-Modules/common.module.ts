import { Module } from '@nestjs/common';
import { LoggerMiddleware } from '../Middlewares/logging.middlewares';
import { EncryptionService } from '../Utils/Security/encryption';

@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class CommonModule {}
