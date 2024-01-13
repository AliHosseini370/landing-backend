import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({required: true})
    fullName: string

    @Prop({required: true, unique: true})
    email: string

    @Prop({required: true, unique: true})
    phoneNumber: string

    @Prop({required: true})
    password: string

    @Prop({required: true, default: false})
    isAdmin: boolean
}

export const userSchema = SchemaFactory.createForClass(User)