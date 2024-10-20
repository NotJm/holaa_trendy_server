import { Injectable } from '@nestjs/common';
import zxcvbn from 'zxcvbn';

@Injectable()
export class ZxcvbnService {
    validatePassword(password: string): any {
        const result = zxcvbn(password);
        result.score < 3 ? result : null
    }
}
