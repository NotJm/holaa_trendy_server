import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { In, Repository } from 'typeorm';
import {
  CreateCategoryDto as CreateCategorieDto,
  CreateManyCategoriesDto,
} from './dtos/create.category.dto';
import {
  UpdateCategoryDto,
  UpdateManyCategoriesDto,
} from './dtos/update.category.dto';
import { Category } from './entity/category.entity';
import { CategoryResponseDto, toCategoryResponseDto } from './dtos/category.response.dto';

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
   * @param name Codigo de la categoria
   * @returns Regresa categoria con el codigo que coincida
   */
  async findCategoryByName(name: string): Promise<Category> {
    return this.findOne({
      relations: ['subCategories'],
      where: { name: name },
    });
  }
  
  async findCategoriesByNames(names: string[]): Promise<Category[]> {
    return this.find({
      relations: ['subCategories'],
      where: { name: In(names) },
    })
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.findOne({
      relations: ['subCategories'],
      where: {
        id: id,
      }
    })
  }
  
  async findAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.find({ relations: ['subCategories'] });

    return  categories.map((category) => toCategoryResponseDto(category));
  
  }

  /**
   * Metodo sobrecargado que actualiza categorias
   * @param id Codigo de la categoria
   * @param data Datos a actualizar
   * @returns Regresa categoria actualizada
   */
  protected async update(
    id: string,
    data: Partial<Category>,
  ): Promise<Category> {
    const entity = await this.findCategoryById(id);

    if (!entity) {
      throw new NotFoundException(`Categoria con el codigo ${id} no encontrado`);
    }

    Object.assign(entity, data);

    await this.repository.save(data);
    return await this.findCategoryById(id);
  }

  /**
   * Metodo sobrecargado para eliminar una categora por ID
   * @param id Codigo de la categoria
   * @returns Categoria removida
   */
  protected async deleteById(id: string): Promise<Category> {
    const entity = await this.findCategoryById(id);

    if (!entity) {
      throw new NotFoundException(`Categoria con el codigo ${id} no encontrado`);
    }

    return await this.categoriesRepository.remove(entity);
  }

  /**
   * Metodo para crear una categoria
   * @param createCategoryDto Estrucutura para crear una categoria
   * @returns Regresa categoria creada
   */
  async createOne(createCategoryDto: CreateCategorieDto): Promise<Category> {
    const { name } = createCategoryDto;

    const existsCategory = await this.findCategoryByName(name);

    if (existsCategory) {
      throw new ConflictException(
        `Categoria con el nombre ${name} ya se encuentra registrado`,
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
    const createCategories = await Promise.all(
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
  async getCategories(): Promise<CategoryResponseDto[]> {
    return await this.findAllCategories();
  }

  /**
   * Metodo Actualiza una categoria
   * @param updateCategoryDto Estructura para actualizar una categoria
   * @returns Regresa categoria actualizada
   */
  async updateOne(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { id, newName, newDescription } = updateCategoryDto;

    const category = await this.findCategoryById(id);

    if (!category) {
      throw new NotFoundException(
        `Categoria con el identificador ${id} no encontrado`,
      );
    }

    if (newName) {
      const existsCategoryNewCode = await this.findCategoryByName(newName);

      if (existsCategoryNewCode) {
        throw new ConflictException(
          `El nombre ${newName} ya existe en una categoria, Por favor utilice un nombre diferente`,
        );
      }

      category.name = newName;
    }

    if (newDescription) {
      category.description = newDescription;
    }

    return await this.update(id, category);
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
    const updateCategories = await Promise.all(
      categories.map(async (category) => {
        return await this.updateOne(category);
      }),
    );
    return updateCategories;
  }

  /**
   * Metodo para eliminar una categoria
   * @param id Identificador unico de la categoria
   * @returns Regresa categoria eliminada
   */
  async deleteOne(id: string): Promise<Category> {
    return await this.deleteById(id);
  }

  /**
   * Metodo para eliminar varias categorias
   * @param ids Identificadores unicos de la categoria
   * @returns Regresa las categorias eliminadas
   */
  async deleteMany(ids: string[]): Promise<Category[]> {
    const deleteCategories = await Promise.all(
      ids.map(async (id) => {
        return await this.deleteOne(id);
      }),
    );
    return deleteCategories;
  }
}
