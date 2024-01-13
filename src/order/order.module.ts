import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from 'src/schemas/order.schema';
import { HttpModule } from '@nestjs/axios';
import { Product, productSchema } from 'src/schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Order.name, schema: orderSchema}]), MongooseModule.forFeature([{ name: Product.name, schema: productSchema}]), HttpModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
