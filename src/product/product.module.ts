import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Product.name, schema: productSchema}])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
