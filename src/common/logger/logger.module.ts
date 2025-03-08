import { Global, Module } from '@nestjs/common';
import { LoggerApp } from './logger.service';

@Global()
@Module({
  providers: [LoggerApp],
  exports: [LoggerApp],
})
export class LoggerModule {}
