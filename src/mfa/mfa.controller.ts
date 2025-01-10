import { Body, Controller, Post, Res } from '@nestjs/common';
import { MFAService } from './mfa.service';
import { MFACodeDto } from './dtos/mfa-code.dto';

@Controller('mfa')
export class MFAController {
  constructor(private readonly mfaService: MFAService) {}

  @Post('verify')
  async verify(@Body() mfaCodeDto: MFACodeDto) {
    return await this.mfaService.verify(mfaCodeDto);
  }
}
