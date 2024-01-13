import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "./product.schema";
import mongoose from "mongoose";

@Schema()
export class Order {
    @Prop({required: true})
    fullName: string

    @Prop({required: true})
    email: string

    @Prop({required: true})
    phoneNumber: string

    @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'})
    product: Product

    @Prop({default:Date.now})
    createdAt: Date
}

export const orderSchema = SchemaFactory.createForClass(Order)