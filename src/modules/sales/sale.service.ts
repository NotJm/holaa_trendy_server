import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../common/base.service';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/entity/cart.entity';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { SaleByCategoryResponseDto } from './dtos/sale-by-category.response.dto';
import { SaleItem } from './entity/sale-item.entity';
import { Sale } from './entity/sale.entity';
import { StockDepletionTime } from './entity/stock-depletion-time.entity';
import { CartResponseDto } from '../cart/dtos/cart.response.dto';

@Injectable()
export class SaleService extends BaseService<Sale> {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    @InjectRepository(StockDepletionTime)
    private readonly stockDepletionTimeRepository: Repository<StockDepletionTime>,
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {
    super(saleRepository);
  }

  private async findSaleByUser(user: User): Promise<Sale> {
    return this.findOne({
      relations: ['saleItems', 'saleItems.product'],
      where: {
        user: user,
      },
    });
  }

  private async findSalesByCategory(categoryName: string): Promise<any[]> {
    return await this.saleItemRepository
    .createQueryBuilder('sa')
    .select([
      'c.name AS categoryName',
      'p.code AS productCode',
      'p.name AS productName',
      'p.img_uri AS productImage',
      'p.stock AS stockInitial',
      's.created_at AS registerSale',
      'sa.quantity AS saleQuantity',
    ])
    .innerJoin('sa.sale', 's')
    .innerJoin('sa.product', 'p')
    .innerJoin('p.category', 'c')
    .where('c.name = :categoryName', { categoryName })
    .andWhere('s.created_at = (SELECT MAX(s2.created_at) FROM sale_items sa2 INNER JOIN sales s2 ON sa2.sale_id = s2.id WHERE sa2.product_id = sa.product_id)')
    .groupBy('c.name')
    .addGroupBy('p.code')
    .addGroupBy('p.name')
    .addGroupBy('p.img_uri')
    .addGroupBy('p.stock')
    .addGroupBy('s.created_at')
    .addGroupBy('sa.quantity')
    .orderBy('sa.quantity', 'DESC')
    .getRawMany();
  }

  private async createSale(user: User): Promise<Sale> {
    return this.create({ user: user });
  }

  private async getOrCreateSale(user: User): Promise<Sale> {
    let sale = await this.findSaleByUser(user);

    if (!sale) {
      sale = await this.createSale(user);
    }

    return sale;
  }

  public async add(userId: string): Promise<CartResponseDto> {
    return this.dataSource.transaction(async (entityManager: EntityManager) => {
      const user = await this.usersService.findUserById(userId);

      const sale = await this.getOrCreateSale(user);

      const cart = await this.cartService.getCart(userId);

      if (!cart.items.length) {
        throw new Error('El carrito está vacío');
      }

      if (!sale.saleItems) {
        sale.saleItems = [];
      }

      const salesItems = cart.items.map((item) => {
        return this.saleItemRepository.create({
          sale: sale,
          product: item.product,
          quantity: item.quantity,
        });
      });

      await entityManager.save(this.saleItemRepository.target, salesItems);

      sale.saleItems.push(...salesItems);

      await entityManager.save(this.saleRepository.target, sale);

      return await this.cartService.clearCart(userId);
    });
  }

  async getStockDepletion(): Promise<StockDepletionTime[]> {
    return await this.stockDepletionTimeRepository.find();
  }

  async getSalesByCategory(category: string): Promise<SaleByCategoryResponseDto[]> {
    const results = await this.findSalesByCategory(category)
    
    const formattedResults = results.map(result => ({
      categoryName: result.categoryname,  
      productCode: result.productcode,
      productName: result.productname,
      productImage: result.productimage,
      stockInitial: result.stockinitial,
      registerSale: result.registersale,
      saleQuantity: result.salequantity,
    }));
  
    return plainToInstance(SaleByCategoryResponseDto, formattedResults, {
      excludeExtraneousValues: true,
    });
  }
}
