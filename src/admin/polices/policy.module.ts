import { PolicyService } from './policy.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyController } from './policy.controller';
import { Policy, PolicySchema } from './schemas/policy.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }])],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService]
  
})
export class PolicyModule {}
