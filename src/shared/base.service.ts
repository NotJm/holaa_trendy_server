import { InternalServerErrorException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';

export abstract class BaseService<T> {

  protected repository: Repository<T>

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  protected async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  protected async findOne(filter: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(filter)
  }

  protected async findById(id: string): Promise<T> {
    return this.repository.findOne({ where: { id } as any });
  }

  protected async create(data: T): Promise<T> {
    const entity = this.repository.create(data);

    if (entity) {
      return this.repository.save(entity);
    } else {
      throw new InternalServerErrorException('Error al momento de crear usuario')
    }
  }

  protected async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new InternalServerErrorException(`Entidad con la ID ${id} no encontrada`);
    }

    Object.assign(entity, data);

    await this.repository.save(entity);
    return entity;
  }

  protected async deleteById(id: string): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new InternalServerErrorException(`Entidad con la ID ${id} no encontrada`);
    }

    await this.repository.remove(entity);

  }

  protected async delete(filter: FindOneOptions): Promise<void> {
    const entity = await this.findOne(filter);

    if (!entity) {
      throw new InternalServerErrorException(`No se pudo eliminar la entidad especificada`);
    }

    await this.repository.remove(entity);
  }



} 
