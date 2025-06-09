import { Expose, plainToInstance } from 'class-transformer';
import { Audit } from '../entity/audit.entity';
import { ACTIONS_TYPE } from '../../../common/constants/contants';

export class AuditResponseDto {
  @Expose()
  username: string;

  @Expose()
  action: ACTIONS_TYPE;

  @Expose()
  module: string;

  @Expose()
  oldValue: any;

  @Expose()
  newValue: any;

  @Expose()
  ipAddress: string;

  @Expose()
  userAgent: string;
}

export const toAuditResponseDto = (audit: Audit): AuditResponseDto => {
  return plainToInstance(AuditResponseDto, {
    username: audit.user.username,
    action: audit.action,
    module: audit.module,
    oldValue: audit.oldValue,
    newValue: audit.newValue,
    ipAddress: audit.ipAddress,
    userAgent: audit.userAgent,
  });
};
