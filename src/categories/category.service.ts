import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import {
  CreateCategoryDto as CreateCategorieDto,
  CreateManyCategoriesDto,
} from './dtos/create.category.dto';
import {
  UpdateCategoryDto,
  UpdateManyCategoriesDto,
} from './dtos/update.category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
  }

  /**
   * Busca categorias por codigo
   * @param code Codigo de la categoria
   * @returns Regresa categoria con el codigo que coincida
   */
  async findCategoryByCode(code: string): Promise<Category> {
    return await this.findOne({ where: { code: code } });
  }

  /**
   * Metodo sobrecargado que actualiza categorias
   * @param code Codigo de la categoria
   * @param data Datos a actualizar
   * @returns Regresa categoria actualizada
   */
  protected async update(
    code: string,
    data: Partial<Category>,
  ): Promise<Category> {
    const entity = await this.findCategoryByCode(code);

    if (!entity) {
      throw new NotFoundException(`Categoria con el codigo ${code} no existe`);
    }

    Object.assign(entity, data);

    await this.repository.update(code, data);
    return entity;
  }

  /**
   * Metodo sobrecargado para eliminar una categora por ID
   * @param code Codigo de la categoria
   * @returns Categoria removida
   */
  protected async deleteById(code: string): Promise<Category> {
    const entity = await this.findCategoryByCode(code);

    if (!entity) {
      throw new NotFoundException(`Categoria con el codigo ${code} no existe`);
    }

    return await this.categoriesRepository.remove(entity);
  }

  /**
   * Metodo para crear una categoria
   * @param createCategoryDto Estrucutura para crear una categoria
   * @returns Regresa categoria creada
   */
  async createOne(createCategoryDto: CreateCategorieDto): Promise<Category> {
    const { code } = createCategoryDto;

    const existsCategory = await this.findCategoryByCode(code);

    if (existsCategory) {
      throw new ConflictException(
        `Categoria con el codigo '${code}' ya existe`,
      );
    }

    return await this.create(createCategoryDto);
  }

  /**
   * Metodo para crear varias categorias
   * @param createManyCategoriesDto Estructura para crear varias categorias
   * @returns Categorias creadas
   */
  async createMany(
    createManyCategoriesDto: CreateManyCategoriesDto,
  ): Promise<Category[]> {
    const { categories } = createManyCategoriesDto;
    const createCategories = Promise.all(
      categories.map(async (category) => {
        return await this.createOne(category);
      }),
    );
    return createCategories;
  }

  /**
   * Metodo para obtener todas las categorias con sus sub categorias
   * @returns Arreglo de categorias
   */
  async getCategories(): Promise<Category[]> {
    return await this.find({ relations: ['subCategories'] });
  }

  /**
   * Metodo Actualiza una categoria
   * @param updateCategoryDto Estructura para actualizar una categoria
   * @returns Regresa categoria actualizada
   */
  async updateOne(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { code, newCode, description } = updateCategoryDto;

    const category = await this.findCategoryByCode(code);

    if (!category) {
      throw new NotFoundException(
        `Categoria con el codigo ${code} no encontrada`,
      );
    }

    if (newCode) {
      const existsCategoryNewCode = await this.findCategoryByCode(newCode);

      if (existsCategoryNewCode) {
        throw new ConflictException(
          'El codigo ya existe, Por favor utilice un codigo diferente',
        );
      }

      category.code = newCode;
    }

    if (description) {
      category.description = description;
    }

    return await this.update(code, category);
  }

  /**
   * Metodo para actualizar varias categorias
   * @param updateManyCategoriesDto Arreglo de categorias a actualizar
   * @returns Regresa categorias actualizaas
   */
  async updateMany(
    updateManyCategoriesDto: UpdateManyCategoriesDto,
  ): Promise<Category[]> {
    const { categories } = updateManyCategoriesDto;
    const updateCategories = Promise.all(
      categories.map(async (category) => {
        return await this.updateOne(category);
      }),
    );
    return updateCategories;
  }

  /**
   * Metodo para eliminar una categoria
   * @param code Codigo de la categoria
   * @returns Regresa categoria eliminada
   */
  async deleteOne(code: string): Promise<Category> {
    return await this.deleteById(code);
  }

  /**
   * Metodo para eliminar varias categorias
   * @param codes Arreglo de codigo de la categoria
   * @returns Regresa las categorias eliminadas
   */
  async deleteMany(codes: string[]): Promise<Category[]> {
    const deleteCategories = Promise.all(
      codes.map(async (code) => {
        return await this.deleteOne(code);
      }),
    );
    return deleteCategories;
  }
}
