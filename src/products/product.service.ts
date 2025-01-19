import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base.service';
import { Products, ProductsDocument } from './entity/product.schema';
import { CreateProductDto } from './dtos/create.product.dto';

@Injectable()
export class ProductService extends BaseService<ProductsDocument> {


}
