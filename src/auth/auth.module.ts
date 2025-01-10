import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PwnedService } from '../common/providers/pwned.service';
import { HttpModule } from '@nestjs/axios';
import { OtpService } from '../common/providers/otp.service';
import { IncidentModule } from '../admin/incident/incident.module';
import { EmailModule } from 'src/admin/email/email.module';
import { EmailService } from 'src/admin/email/email.service';
import {
  EmailConfiguration,
  EmailConfigurationSchema,
} from 'src/admin/email/schemas/email.config.schema';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { JWT_AGE } from 'src/constants/contants';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: EmailConfiguration.name, schema: EmailConfigurationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: JWT_AGE },
      }),
      inject: [ConfigService],
    }),
    IncidentModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PwnedService,
    EmailService,
    OtpService,
    JwtStrategy,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
