import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
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
   * @param names Codigos de las sub categorias
   * @returns Regresa un arreglo de sub categorias
   */
  public async findSubCategoriesByNames(
    names: string[],
  ): Promise<SubCategory[]> {
    const subCategories = await this.find({
      relations: ['categories'],
      where: {
        name: In(names),
      },
    });

    if (!subCategories) {
      throw new NotFoundException(
        'No se pudo encontrar ninguna coincidencia con las sub categorias',
      );
    }

    return subCategories;
  }

  public async existsSubCategoriesByNames(
    names: string[]
  ): Promise<boolean> {
    const subCategories = await this.find({
      relations: ['categoires'],
      where: {
        name: In(names)
      }
    });

    return !!subCategories;
  }

  /**
   * Metodo que encuentra una sub categoria por codigo
   * @param code Codigo de la sub categoria
   * @returns Regresa la sub categoria encontrada
   */
  private async findSubCategoryByName(code: string): Promise<SubCategory> {
    return this.findOne({
      relations: ['categories'],
      where: {
        name: code,
      },
    });
  }

  private async findSubCategoryById(id: string): Promise<SubCategory> {
    return this.findOne({
      relations: ['categories'],
      where: {
        id: id,
      },
    });
  }

  private async findSubCategoriesByCategory(
    categoryName: string,
  ): Promise<SubCategory[]> {
    return await this.find({
      relations: ['categories'],
      where: {
        categories: {
          name: categoryName,
        },
      },
    });
  }

  /**
   * Metodo sobrecargado para actualizar una sub categoria por codigo
   * @param id Codigo de la sub categoria
   * @param data Estructura parcial para actualizar datos de la sub categoria
   * @returns Regresa la sub categoria actualizada
   */
  protected async update(
    id: string,
    data: Partial<SubCategory>,
  ): Promise<SubCategory> {
    const entity = await this.findSubCategoryById(id);

    if (!entity) {
      throw new NotFoundException(
        `Sub Categoria con el ID ${id} no encontrado`,
      );
    }

    Object.assign(entity, data);

    await this.repository.save(data);

    return this.findSubCategoryById(id);
  }

  /**
   * Metodo sobrecargado para eliminar una sub categoria por id
   * @param id
   */
  protected async deleteById(id: string): Promise<SubCategory> {
    const entity = await this.findSubCategoryById(id);

    if (!entity) {
      throw new NotFoundException(
        `Sub Categoria con el ID ${id} no encontrado`,
      );
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
    const { name, categoriesNames } = createSubCategoryDto;

    const existsSubCategory = await this.findSubCategoryByName(name);

    if (existsSubCategory) {
      throw new ConflictException(
        `Sub Categoria con el nombre ${name} ya se encuentra registradoya existe`,
      );
    }

    const existsCategories =
      await this.categoryService.findCategoriesByNames(categoriesNames)

    if (existsCategories.length !== categoriesNames.length) {
      const foundCodes = existsCategories.map((cat) => cat.name);
      const missingCodes = categoriesNames.filter(
        (code) => !foundCodes.includes(code),
      );
      throw new NotFoundException(
        `Las siguientes categorías no fueron encontradas: ${missingCodes.join(', ')}`,
      );
    }

    return await this.create({
      name: name,
      categories: existsCategories,
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
    const createSubCategories = await Promise.all(
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
    return this.find({
      relations: ['categories'],
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

  public async getSubCategoryByName(name: string): Promise<SubCategory> {
    return this.findOne({
      relations: ['categories'],
      where: {
        name: name,
      },
    });
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
    const { id, newName, newCategoriesNames } = updateSubCategoryDto;

    const subCategory = await this.findSubCategoryById(id);

    if (!subCategory) {
      throw new NotFoundException(
        `Sub Categoria con el ID ${id} no encontrado`,
      );
    }

    if (newName) {
      const existsSubCategoryNewName =
        await this.findSubCategoryByName(newName);

      if (existsSubCategoryNewName) {
        throw new ConflictException(
          `El nombre ${name} ya existe, Por favor utilice un nombre diferente`,
        );
      }

      subCategory.name = newName;
    }

    if (newCategoriesNames) {
      const newCategories = await Promise.all(
        newCategoriesNames.map(async (categoryName) => {
          const category =
            await this.categoryService.findCategoryByName(categoryName);
          if (!category) {
            throw new NotFoundException(
              `Categoria con el nombre ${categoryName} no encontrada`,
            );
          }
          return category;
        }),
      );

      const currentCategories = new Set<Category>(subCategory.categories);

      newCategories.forEach((category) => currentCategories.add(category));

      subCategory.categories = [...currentCategories];
    }

    return await this.update(id, subCategory);
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
    const updateSubCategories = await Promise.all(
      subCategories.map(async (subCategory) => {
        return await this.updateOne(subCategory);
      }),
    );
    return updateSubCategories;
  }

  /**
   * Metodo para eliminar sub categoria por codigo
   * @param id Codigo de la sub categoria
   * @returns Regresa respuesta normal
   */
  public async deleteOne(id: string): Promise<SubCategory> {
    const subCategory = await this.findSubCategoryById(id);

    if (!subCategory) {
      throw new NotFoundException(`Subcategoria con el ID ${id} no encontrado`);
    }

    return this.deleteById(id);
  }

  public async deleteMany(ids: string[]): Promise<SubCategory[]> {
    const deleteSubCategories = await Promise.all(
      ids.map(async (id) => {
        return await this.deleteOne(id);
      }),
    );
    return deleteSubCategories;
  }
}
