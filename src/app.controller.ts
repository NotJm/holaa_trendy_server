import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('ping')
    ping() {
      try {
        return { status: true };
      } catch (error) {
        throw new HttpException({ status: false }, HttpStatus.SERVICE_UNAVAILABLE);
      }
    }
}
