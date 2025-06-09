import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { ACTIONS_TYPE } from 'src/common/constants/contants';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AuditResponseDto, toAuditResponseDto } from './dto/audit-response.dto';
import { Audit } from './entity/audit.entity';

@Injectable()
export class AuditService extends BaseService<Audit> {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    private readonly userService: UsersService,
  ) {
    super(auditRepository);
  }

  private async findAuditLogs(): Promise<AuditResponseDto[]> {
    const logs = await this.findAll();
    return logs.map((log) => toAuditResponseDto(log));
  }

  public async getLogs(): Promise<AuditResponseDto[]> {
    return await this.findAuditLogs();
  }

  public async registerLog(
    userId: string,
    action: ACTIONS_TYPE,
    module: string,
    entityId?: string,
    oldValue?: any,
    newValue?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const user = await this.userService.findUserById(userId);

    await this.create({
      user: user,
      action: action,
      module: module,
      entityId: entityId,
      oldValue: oldValue,
      newValue: newValue,
      ipAddress: ipAddress,
      userAgent: userAgent,
    });
  }
}
