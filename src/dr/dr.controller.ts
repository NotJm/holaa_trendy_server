import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDrDto } from 'src/dr/dto/create.dr.dto';
import { DrService } from './dr.service';
import { DrDocument } from 'src/dr/schemas/dr.schema';
import { UpdateDrDto } from 'src/dr/dto/update.dr.dto';

@Controller('dt')
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
