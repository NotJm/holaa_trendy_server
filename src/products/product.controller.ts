import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('create')
    async create_product() {}

    @Get('get-all')
    async get_all_products() {}

    @Put('update/:id')
    async update_product(@Param('id') id: string) {}

    @Delete('delete/:id')
    async delete_product(@Param('id') id: string) {}

}
