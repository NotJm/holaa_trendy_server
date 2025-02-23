import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { IV_LENGTH } from '../../../common/constants/contants';

@Injectable()
export class AESService {
  constructor(private readonly configService: ConfigService) {}

  public encrypt(secret: string): string {
    const KEY = this.configService.get<string>('ENCRIPTION_KEY');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(KEY, 'hex'),
      iv,
    );
    let encrypted = cipher.update(secret, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  public decrypt(encrypt: string): string {
    const KEY = this.configService.get<string>('ENCRIPTION_KEY');
    const [iv, authTag, encryptedText] = encrypt.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(KEY, 'hex'),
      Buffer.from(iv, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
