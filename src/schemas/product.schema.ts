import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product {
    @Prop({required: true})
    title: string

    @Prop({required: true})
    image: string

    @Prop({required: true})
    price: number

    @Prop({default: Date.now})
    createdAt: Date
}

export const productSchema = SchemaFactory.createForClass(Product)