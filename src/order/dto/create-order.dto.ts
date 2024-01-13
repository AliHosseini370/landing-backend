import { IsEmail, IsMongoId, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    fullName: string

    @IsEmail()
    email: string

    @IsString()
    phoneNumber: string

    @IsMongoId()
    productId: string
}
