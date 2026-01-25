import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly KEY: Buffer;
  private readonly ALGORITHM = 'aes-256-ctr';
  private readonly IV = Buffer.alloc(16, 0); 

  constructor(private configService: ConfigService) {
    const CRYPTO_KEY = this.configService.get<string>('CRYPTO_KEY');
    if (!CRYPTO_KEY) {
      throw new Error('CRYPTO_KEY is missing in environment variables');
    }
    this.KEY = crypto.scryptSync(CRYPTO_KEY, 'salt', 32);
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, this.IV);
    return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');
  }

  decrypt(cipherText: string): string {
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, this.IV);
    return Buffer.concat([
      decipher.update(Buffer.from(cipherText, 'hex')),
      decipher.final()
    ]).toString('utf8');
  }
}
