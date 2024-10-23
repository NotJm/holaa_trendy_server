import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialSite, SocialSiteSchema } from './schemas/social.sites.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialSite.name, schema: SocialSiteSchema }])
  ],
  controllers: [SocialController],
  providers: [SocialService, JwtService],
  exports: [SocialService]
})
export class SocialModule {}
