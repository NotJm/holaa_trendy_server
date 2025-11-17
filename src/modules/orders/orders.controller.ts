import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseController } from 'src/common/base.controller';
import { ORDER_STATUS } from 'src/common/constants/contants';
import { Repository } from 'typeorm';
import { Order } from './entity/orders.entity';

@Controller('orders')
export class OrdersController extends BaseController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super();
  }

  // Crear una nueva orden
  @Post()
  async createOrder(@Body() data: Partial<Order>) {
    try {
      const order = this.orderRepository.create(data);
      return {
        message: 'Orden creada exitosamente',
        status: HttpStatus.OK,
        data: await this.orderRepository.save(order),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Obtener todas las órdenes
  @Get()
  async getAllOrders() {
    try {
      return {
        message: 'Orden creada exitosamente',
        status: HttpStatus.OK,
        data: await this.orderRepository.find({
          relations: ['user', 'items', 'items.product'],
        }),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Obtener una orden específica
  @Get(':id')
  async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  // Editar una orden (asignar entregador, cambiar estado, etc.)
  @Put(':id')
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Order>,
  ) {
    await this.orderRepository.update(id, data);
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  @Patch(':id/verify-code')
  async verifyCode(
    @Param('id') id: string,
    @Body('code') code: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    console.log(order.deliveryCode);
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (!order.deliveryCode)
      throw new BadRequestException('No hay código asignado');
    if (order.deliveryCode !== code)
      throw new BadRequestException('Código incorrecto');

    order.status = ORDER_STATUS.DELIVERED;
    order.deliveredAt = new Date();

    return this.orderRepository.save(order);
  }
}
