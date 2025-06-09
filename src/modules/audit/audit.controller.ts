import { Controller, Get, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { ROLE } from 'src/common/constants/contants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.ADMIN)
export class AuditController extends BaseController {

  constructor(private readonly auditService: AuditService) {
    super();
  }

  @Get()
  async getAudit(): Promise<IApiResponse> {
    try {

    } catch (error) {
      return this.handleError(error);
    }
  }

}
