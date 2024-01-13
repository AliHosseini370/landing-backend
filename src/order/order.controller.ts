import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('callback')
  async callbackOrder(@Res() res: Response, @Query('fullName') fullName: string, @Query('email') email: string, @Query('phoneNumber') phoneNumber: string, @Query('productId') productId: string, @Query('price') price: string, @Query('Authority') Authority: string, @Query('Status') Status: string) {
    const redirectUrl = await this.orderService.callbackOrder(fullName, email, phoneNumber, productId, price, Authority, Status)
    res.redirect(redirectUrl)
  }
  
  @UseGuards(AuthGuard)
  @Get()
  findAllOrders() {
    return this.orderService.findAllOrders();
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.orderService.findOneOrder(id);
  }
  
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeOrder(@Param('id') id: string) {
    return this.orderService.removeOrder(id);
  }
}
