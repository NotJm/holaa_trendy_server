import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
