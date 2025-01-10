import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('create')
    async createProduct() {}

    @Get()
    async findAllProducts() {
    }

    @Put('update/:id')
    async updateProduct(@Param('id') id: string) {}

    @Delete('delete/:id')
    async deleteProduct(@Param('id') id: string) {}

}
