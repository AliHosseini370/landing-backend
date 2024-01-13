import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>){}
  private readonly logger = new Logger(ProductService.name)
  
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { title, image, price } = createProductDto
    try {
      const newProduct: Product = await this.productModel.create({title, image, price})
      if (!newProduct) throw new BadRequestException('Error While Creating Product')
      return newProduct;
    } catch (error) {
      this.logger.error(`An Error Occurred While Crating Product: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAllProducts(): Promise<Product[]> {
    try {
      const products: Product[] = await this.productModel.find({}).sort({createdAt: -1})
      if (!products || products.length === 0) throw new NotFoundException('Cant Find Any Products')
      return products;
    } catch (error) {
      this.logger.error(`An Error Occurred While Getting Products: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOneProduct(id: string): Promise<Product> {
    try {
      const product: Product = await this.productModel.findById(id)
      if (!product) throw new NotFoundException('Product Not Found !')
      return product;
    } catch (error) {
      this.logger.error(`An Error Occurred While Getting Product: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const updatedProduct: Product = await this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true})
      if (!updatedProduct) throw new BadRequestException('Error While Updating Product')
      return updatedProduct
    } catch (error) {
      this.logger.error(`An Error Occurred While Updating Product: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async removeProduct(id: string): Promise<Product> {
    try {
      const deletedProduct: Product = await this.productModel.findByIdAndDelete(id, {new: true})
      if (!deletedProduct) throw new BadRequestException('Error While Deleting Product')
      return deletedProduct
    } catch (error) {
      this.logger.error(`An Error Occurred While Deleting Product: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }
}
