import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({ name: 'low_stock_products', synchronize: false})
export class LowStockProducts {
  @ViewColumn({ name: 'product_name' })
  productName: string;

  @ViewColumn({ name: 'category_name' })
  categoryName: string;

  @ViewColumn({ name: 'subcategories_names' })
  subCategoriesName: string[];

  @ViewColumn({ name: 'total_stock' })
  totalStock: number;  
}