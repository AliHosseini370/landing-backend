import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/schemas/order.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { Product } from 'src/schemas/product.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>, @InjectModel(Product.name) private productModel: Model<Product>, private readonly httpService:HttpService){}
  private readonly logger = new Logger(OrderService.name)
  
  async findAllOrders(): Promise<Order[]> {
    try {
      const orders: Order[] = await this.orderModel.find({}).sort({createdAt: -1}).populate('product')
      if (!orders || orders.length === 0) throw new NotFoundException('Cant Find Any Orders')
      return orders
    } catch (error) {
      this.logger.error(`An Error Occurred While getting Products: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }
  
  async findOneOrder(id: string): Promise<Order> {
    try {
      const order: Order = await this.orderModel.findById(id).populate('product')
      if (!order) throw new NotFoundException('Cant Find This Product / Incorrect Id?')
      return order
    } catch (error) {
      this.logger.error(`An Error Occurred While getting Product: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<string> {
    const { fullName, email, phoneNumber, productId } = createOrderDto
    const encodedFullName = encodeURIComponent(fullName);
    const encodedEmail = encodeURIComponent(email);
    const encodedPhoneNumber = encodeURIComponent(phoneNumber);
    try {
      const product: Product = await this.productModel.findById(productId)
      if (!product) throw new NotFoundException('No Such Product / Incorrect Id ?')
      const paymentUrl = await firstValueFrom(this.httpService.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
        merchant_id: process.env.ZARIN_MERCHANT,
        amount: product.price,
        currency: 'IRT',
        description: `خرید ${product.title}`,
        callback_url: `${process.env.CALLBACK_URL}?fullName=${encodedFullName}&email=${encodedEmail}&phoneNumber=${encodedPhoneNumber}&productId=${productId}&price=${product.price}`,
        metadata: [
          phoneNumber,
          email
        ],
      }))
      if (paymentUrl.data.data.code !== 100) throw new InternalServerErrorException('Error While Creating PaymentUrl')
      return `https://www.zarinpal.com/pg/StartPay/${paymentUrl.data.data.authority}`
    } catch (error) {
        this.logger.error(`An Error Occurred While Creating Payment Url: ${error.message}`, error.stack)
        throw new InternalServerErrorException(error.message)
    }
  }

  async callbackOrder(fullName: string, email: string, phoneNumber: string, productId: string, price: string, Authority: string, Status: string): Promise<string> {
    try {
      if (Status !== 'OK') return 'https://google.com'
      const verifyPayment = await firstValueFrom(this.httpService.post('https://api.zarinpal.com/pg/v4/payment/verify.json', {
        authority: Authority,
        merchant_id: process.env.ZARIN_MERCHANT,
        amount: Number(price),
      }))
      if (verifyPayment.data.code !== 100) return 'https://www.npmjs.com/package/class-validator'
      const order: Order = await this.orderModel.create({fullName, email, phoneNumber, product: productId})
      if(!order) throw new BadRequestException('Error While Creating Order')
      return 'succes-page'
    } catch (error) {
      this.logger.error(`An Error Occurred While Creating Order: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const updatedOrder: Order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true})
      if (!updateOrderDto) throw new BadRequestException('Error While Updating Order')
      return updatedOrder
    } catch (error) {
      this.logger.error(`An Error Occurred While Updating Order: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async removeOrder(id: string): Promise<Order> {
    try {
      const deletedOrder: Order = await this.orderModel.findByIdAndDelete(id, { new: true})
      if (!deletedOrder) throw new BadRequestException('Error While deleteing Order')
      return deletedOrder
    } catch (error) {
      this.logger.error(`An Error Occurred While deleteing Order: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }
}
