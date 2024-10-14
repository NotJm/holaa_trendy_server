import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { IncidentModule } from 'src/incident/incident.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from 'src/services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService]
    }),
    IncidentModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
