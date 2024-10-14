import { GenerateMfaSecretDto } from './mfa.dto';
export declare class MfaService {
    generateMfaSecret(generateMfaSecretDto: GenerateMfaSecretDto): Promise<void>;
}
