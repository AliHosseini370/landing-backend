import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ProductModule, OrderModule, UserModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
