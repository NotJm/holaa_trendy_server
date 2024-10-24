import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument } from './schemas/policy.schemas';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Injectable()
export class PolicyService {
  constructor(@InjectModel(Policy.name) private policyModel: Model<PolicyDocument>) {}

  // Crear una nueva política
  async create(createPolicyDto: CreatePolicyDto): Promise<Policy> {
    const newPolicy = new this.policyModel(createPolicyDto);
    return newPolicy.save();
  }

  // Obtener todas las políticas
  async findAll(): Promise<Policy[]> {
    return this.policyModel.find().exec();
  }

  // Obtener una política por ID
  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyModel.findById(id).exec();
    if (!policy) {
      throw new NotFoundException(`Política con el id ${id} no encontrada`);
    }
    return policy;
  }

  // Actualizar una política
  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<Policy> {
    const updatedPolicy = await this.policyModel.findByIdAndUpdate(id, updatePolicyDto, {
      new: true,
    }).exec();
    if (!updatedPolicy) {
      throw new NotFoundException(`Política con el id ${id} no encontrada`);
    }
    return updatedPolicy;
  }

  // Eliminar una política
  async remove(id: string): Promise<void> {
    const result = await this.policyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Política con el id ${id} no encontrada`);
    }
  }
}
