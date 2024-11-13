import { JwtService } from '@nestjs/jwt';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailConfiguration, EmailConfigurationSchema } from './schemas/email.config.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmailConfiguration.name, schema: EmailConfigurationSchema }])
  ],
  controllers: [EmailController],
  providers: [EmailService, JwtService],
})
export class EmailModule {}
