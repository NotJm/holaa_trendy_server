import { UserMongoService } from './services/user.mongo.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@holaa-datahub.gxqfs.mongodb.net/`,
    ),
  ],
  controllers: [AppController],
  providers: [UserMongoService, AppService],
})
export class AppModule {}
