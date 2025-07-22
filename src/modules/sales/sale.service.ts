import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Between, DataSource, EntityManager, Repository } from 'typeorm';
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
import { LoggerApp } from 'src/common/logger/logger.service';
import { getDateRange } from 'src/common/utils/get-range-date';

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
    private readonly loggerApp: LoggerApp,
  ) {
    super(saleRepository);
  }

  relations: string[] = ['saleItems', 'saleItems.product'];

  private async findSaleByUser(user: User): Promise<Sale> {
    const sale = await this.findOne({
      relations: this.relations,
      where: {
        user: user,
      },
    });

    if (sale) return sale;

    this.loggerApp.warn(
      `No se encontro ninguna venta del usuario con id ${user.id}`,
    );

    throw new NotFoundException(
      `No se encontro ninguna venta del usuario con id ${user.id}`,
    );
  }

  public async findSaleByUserId(userId: string): Promise<Sale> {
    const sale = await this.findOne({
      relations: this.relations,
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (sale) return sale;

    this.loggerApp.warn(
      `No se encontro ninguna venta del usuario con id ${userId}`,
    );
    throw new NotFoundException(
      `No se encontro ninguna venta del usuario con id ${userId}`,
    );
  }

  public async findSalesByUserId(userId: string): Promise<Sale[]> {
    const sales = await this.find({
      relations: this.relations,
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (sales.length > 0) return sales;

    this.loggerApp.warn(
      `No se encontraron ventas del usuarion con id ${userId}`,
    );
    throw new NotFoundException(
      `No se encontraron ventas del usuarion con id ${userId}`,
    );
  }

  public async findCountSales(start: Date, end: Date): Promise<number> {
    const count = await this.saleRepository.count({
      relations: this.relations,
      where: {
        createdAt: Between(start, end),
      },
    });

    return count;
  }

  public async findSaleByDateTime(start: Date, end: Date): Promise<Sale[]> {
    const sales = await this.find({
      relations: this.relations,
      where: {
        createdAt: Between(start, end),
      },
    });

    return sales.length > 0 ? sales : [];
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
      .andWhere(
        's.created_at = (SELECT MAX(s2.created_at) FROM sale_items sa2 INNER JOIN sales s2 ON sa2.sale_id = s2.id WHERE sa2.product_id = sa.product_id)',
      )
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

      const sale = await this.createSale(user);

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

  public async getStockDepletion(): Promise<StockDepletionTime[]> {
    return await this.stockDepletionTimeRepository.find();
  }

  public async getSalesByCategory(
    category: string,
  ): Promise<SaleByCategoryResponseDto[]> {
    const results = await this.findSalesByCategory(category);

    const formattedResults = results.map((result) => ({
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

  public async getCountSalesToday(): Promise<number> {
    const { start, end } = getDateRange(new Date());

    const count = await this.findCountSales(start, end);

    return count;
  }

  public async getCountSalesAnyDate(date: Date): Promise<number> {
    const { start, end } = getDateRange(date);

    const count = await this.findCountSales(start, end);

    return count;
  }

  public async getIncomeToday(): Promise<number> {
    const count = await this.getCountSalesToday();

    let income: number = 0;

    const { start, end } = getDateRange(new Date());

    if (count == 0) return 0;

    const sales = await this.findSaleByDateTime(start, end);

    for (const sale of sales) {
      for (const item of sale.saleItems) {
        income += item.product.price * item.quantity;
      }
    }

    return income;
  }

  public async getIncomeAnyDate(date: Date): Promise<number> {
    const count = await this.getCountSalesAnyDate(date);

    let income: number = 0;

    const { start, end } = getDateRange(date);

    if (count == 0) return 0;

    const sales = await this.findSaleByDateTime(start, end);

    for (const sale of sales) {
      for (const item of sale.saleItems) {
        income += item.product.price * item.quantity;
      }
    }

    return income;
  }

  public async getRankingProducts(): Promise<
    { name: string; nSales: number }[]
  > {
    const sales = await this.find({ relations: this.relations });

    const counts = new Map<string, number>();

    for (const sale of sales) {
      for (const item of sale.saleItems) {
        const productName = item.product.name;
        const quantity = item.quantity;

        counts.set(productName, (counts.get(productName) || 0) + quantity);
      }
    }

    const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, nSales]) => ({ name, nSales }));

    return top;
  }
}
