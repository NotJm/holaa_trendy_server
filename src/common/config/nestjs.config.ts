import { NestApplicationOptions } from "@nestjs/common";

export const nestjsConfig = (): NestApplicationOptions => ({
  logger: ['error', 'fatal'] 
})