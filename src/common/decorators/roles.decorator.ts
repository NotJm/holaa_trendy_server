import { SetMetadata } from '@nestjs/common';
import { ROLE, ROLES_KEY } from 'src/common/constants/contants';

export const Roles = (...roles: [ROLE, ...ROLE[]]) => SetMetadata(ROLES_KEY, roles)
