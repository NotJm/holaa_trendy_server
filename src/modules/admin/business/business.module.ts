import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialSite, SocialSiteSchema } from './schemas/social.sites.schema';
import { Business, BusinessSchema } from './schemas/business.schema';
import { JwtService } from '@nestjs/jwt';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    AuditModule,
    MongooseModule.forFeature([
      {
        name: SocialSite.name,
        schema: SocialSiteSchema,
      },
      {
        name: Business.name,
        schema: BusinessSchema,
      },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, JwtService],
  exports: [BusinessService]
})
export class BusinessModule {}
