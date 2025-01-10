import { SetMetadata } from '@nestjs/common';
import { ROLE, ROLES_KEY } from 'src/constants/contants';

export const Roles = (...roles: [ROLE, ...ROLE[]]) => SetMetadata(ROLES_KEY, roles)
