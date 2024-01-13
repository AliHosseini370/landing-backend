import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productService.findOneProduct(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productService.removeProduct(id);
  }
}
