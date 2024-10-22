import { Body, Controller, Post } from '@nestjs/common';

@Controller('admin')
export class AdminController {
    
    @Post('create/socialsite')
    async create(@Body() createSocialSiteDto: any) {}


}
