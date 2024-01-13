import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    title: string

    @IsString()
    image: string

    @IsNumber()
    price: number
}
