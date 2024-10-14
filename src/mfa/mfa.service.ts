import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as  qrcode from 'qrcode';
import { GenerateMfaSecretDto } from './mfa.dto';

@Injectable()
export class MfaService {
    async generateMfaSecret(generateMfaSecretDto: GenerateMfaSecretDto) {
        const secret = speakeasy.generateSecret({
            name: `Authentication (${generateMfaSecretDto.email})`
        })

        const qrCodeImage = qrcode.toDataUrl(secret.otpauth_url);

        
    }


}
