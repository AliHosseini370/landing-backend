import { IsBoolean, IsEmail, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsString()
    fullName: string

    @IsEmail()
    email: string

    @IsString()
    phoneNumber: string

    @IsStrongPassword()
    password: string
}
