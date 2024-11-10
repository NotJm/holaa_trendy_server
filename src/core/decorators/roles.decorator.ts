import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Role, ROLES_KEY } from 'src/constants/contants';

export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role)
