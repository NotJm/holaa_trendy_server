import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CategoryService } from '../categories/category.service';
import {
  CreateManySubCategoriesDto,
  CreateSubCategoryDto,
} from './dtos/create.sub-category.dto';
import {
  UpdateManySubCategoriesDto,
  UpdateSubCategoryDto,
} from './dtos/update.sub-category.dto';
import { SubCategory } from './entity/sub-categories.entity';

@Injectable()
export class SubCategoryService extends BaseService<SubCategory> {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    private readonly categoryService: CategoryService,
  ) {
    super(subCategoryRepository);
  }

  /**
   * Metodo que encuentra sub categorias por medio de sus codigos
   * @param codes Codigos de las sub categorias
   * @returns Regresa un arreglo de sub categorias
   */
  public async findSubCategoriesByCodes(
    codes: string[],
  ): Promise<SubCategory[]> {
    if (!codes || codes.length === 0) {
      throw new Error(
        'Debe de proporcionar al menos un codigo para iniciar la busqueda',
      );
    }

    const subCategories = await this.find({
      where: {
        code: In(codes),
      },
    });

    if (!subCategories) {
      throw new NotFoundException(
        'No se pudo encontrar ninguna coincidencia con las sub categorias',
      );
    }

    return subCategories;
  }

  /**
   * Metodo que encuentra una sub categoria por codigo
   * @param code Codigo de la sub categoria
   * @returns Regresa la sub categoria encontrada
   */
  private async findSubCategoryByCode(code: string): Promise<SubCategory> {
    return await this.findOne({
      where: {
        code: code,
      },
    });
  }

  private async findSubCategoriesByCategory(
    category: string,
  ): Promise<SubCategory[]> {
    return await this.find({
      relations: ['categories'],
      where: {
        categories: {
          code: category,
        },
      },
    });
  }

  /**
   * Metodo sobrecargado para actualizar una sub categoria por codigo
   * @param code Codigo de la sub categoria
   * @param data Estructura parcial para actualizar datos de la sub categoria
   * @returns Regresa la sub categoria actualizada
   */
  protected async update(
    code: string,
    data: Partial<SubCategory>,
  ): Promise<SubCategory> {
    const entity = await this.findSubCategoryByCode(code);

    if (!entity) {
      throw new NotFoundException(`Entidad con la ID ${code} no encontrada`);
    }

    Object.assign(entity, data);

    await this.repository.update(code, data);
    return entity;
  }

  /**
   * Metodo sobrecargado para eliminar una sub categoria por id
   * @param code
   */
  protected async deleteById(code: string): Promise<SubCategory> {
    const entity = await this.findSubCategoryByCode(code);

    if (!entity) {
      throw new NotFoundException(`Sub Categoria con el codigo ${code} no existe`);
    }

    return await this.subCategoryRepository.remove(entity);
  }

  /**
   * Metodo para crear una sub categoria
   * @param createSubCategoryDto Estructura donde se definen los datos basicos del sub categoria
   * @returns
   */
  public async createOne(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const { code, category } = createSubCategoryDto;

    const existsSubCategory = await this.findSubCategoryByCode(code);

    if (existsSubCategory) {
      throw new ConflictException(
        `Sub Categoria con el codigo ${code} ya existe`,
      );
    }

    const existsCategory =
      await this.categoryService.findCategoryByCode(category);

    if (!existsCategory) {
      throw new NotFoundException(
        `Categoria con el codigo ${category} no encontrado`,
      );
    }

    return await this.create({
      code: code,
      categories: [existsCategory],
    });
  }

  /**
   * Metodo para crear varias Sub Categorias
   * @param createManySubCategoriesDto Estructura donde se definen los datos basicos para crear varias
   * @returns SubCategorias Creadas
   */
  public async createMany(
    createManySubCategoriesDto: CreateManySubCategoriesDto,
  ): Promise<SubCategory[]> {
    const { subCategories } = createManySubCategoriesDto;
    const createSubCategories = Promise.all(
      subCategories.map(async (subCategory) => {
        return await this.createOne(subCategory);
      }),
    );
    return createSubCategories;
  }

  /**
   * Metodo que obtiene todas las sub categorias
   * @returns Arreglo de sub categorias
   */
  public async getSubCategories(): Promise<SubCategory[]> {
    return await this.find({
      relations: ['categories']
    });
  }

  /**
   * Metodo que obtiene todas las subcategorias por categoria
   * @param category Categoria
   * @returns Regresa arreglos de sub categorias que pertenece a una categoria
   */
  public async getSubCategoriesByCategory(
    category: string,
  ): Promise<SubCategory[]> {
    return this.findSubCategoriesByCategory(category);
  }

  /**
   * Metodo que actualiza la sub categoria
   * @param code Codigo para de la sub categoria a actualizar
   * @param updateSubCategoryDto Estructura donde se definen los datos basicos del sub categoria
   * @returns Regresa la sub categoria actualizada
   */
  public async updateOne(
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const { code, newCode } = updateSubCategoryDto;

    const subCategory = await this.findSubCategoryByCode(code);

    if (!subCategory) {
      throw new NotFoundException(
        `Sub Categoria con el codigo ${code} no encontrada`,
      );
    }

    if (newCode) {
      const existsSubCategoryNewCode =
        await this.findSubCategoryByCode(newCode);

      if (existsSubCategoryNewCode) {
        throw new ConflictException(
          'El codigo ya existe, Por favor utilice un codigo diferente',
        );
      }

      subCategory.code = newCode;
    }

    return await this.update(code, subCategory);
  }

  /**
   * Metodo para actualizar varias sub categorias
   * @param updateManySubCategoriesDto Estructura para actualizar varias sub categorias
   * @returns Sub categorias actualizadas
   */
  public async updateMany(
    updateManySubCategoriesDto: UpdateManySubCategoriesDto,
  ): Promise<SubCategory[]> {
    const { subCategories } = updateManySubCategoriesDto;
    const updateSubCategories = Promise.all(
      subCategories.map(async (subCategory) => {
        return await this.updateOne(subCategory);
      }),
    );
    return updateSubCategories;
  }

  /**
   * Metodo para eliminar sub categoria por codigo
   * @param code Codigo de la sub categoria
   * @returns Regresa respuesta normal
   */
  public async deleteOne(code: string): Promise<SubCategory> {
    return await this.deleteById(code);
  }

  public async deleteMany(codes: string[]): Promise<SubCategory[]> {
    const deleteSubCategories = Promise.all(
      codes.map(async (code) => {
        return await this.deleteOne(code);
      })
    )
    return deleteSubCategories;
  }
}
