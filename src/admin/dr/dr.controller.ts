import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DrService } from './dr.service';
import { JwtAuthGuard } from '../../common/guards/jwtauth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateDrDto } from './dto/create.dr.dto';
import { DrDocument } from './schemas/dr.schema';
import { UpdateDrDto } from './dto/update.dr.dto';


@Controller('dt')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DrController {

    constructor(private readonly drService: DrService) {}

    @Post('create/dr')
    async create(@Body() registerDtDto: CreateDrDto) {
        return await this.drService.create(registerDtDto);
    }

    @Get('get/all')
    async get_all_documents() {
        return await this.drService.find_all(); 
    }

    @Delete('delete/dr/:id')
    async delete(@Param('id') id: string): Promise<DrDocument> {
        return await this.drService.delete(id);
    }

    @Put('update/dr/:id')
    async update(@Param('id') id: string, updateDrDto: UpdateDrDto) {
        return await this.drService.update(id, updateDrDto);
    }

    
}
