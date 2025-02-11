import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  // Crear una nueva política
  @Post('create')
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    console.log(createPolicyDto);
    return this.policyService.create(createPolicyDto);
  }

  // Obtener todas las políticas
  @Get('get/all')
  async findAll() {
    return this.policyService.findAll();
  }

  // Obtener una política por su ID
  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return this.policyService.findOne(id);
  }

  // Actualizar una política
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policyService.update(id, updatePolicyDto);
  }

  // Eliminar una política
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.policyService.remove(id);
  }
}
