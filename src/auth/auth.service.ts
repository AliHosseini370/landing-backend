import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInUserDto } from './dto/signInUserDto.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}
    private readonly logger = new Logger(AuthService.name)

    async createToken (id: string): Promise<string> {
        const payLoad = { sub: id }
        return await this.jwtService.signAsync(payLoad, {secret: process.env.JWT_SECRET, expiresIn: '3d'})
    }

    async validateToken (token: string): Promise<User> {
        const { sub } = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET})
        const user: User = await this.userModel.findById(sub)
        if (!user) throw new UnauthorizedException('Cant Find This User / Inavild Token ?')
        return user
    }

    async signUp (createUserDto: CreateUserDto): Promise<string> {
        const { fullName, email, phoneNumber, password } = createUserDto
        try {
            const hash = await bcrypt.hash(password, 10)
            const newUser = await this.userModel.create({fullName, email, phoneNumber, password: hash, isAdmin: false})
            if (!newUser) throw new BadRequestException('Error While Creating User')
            const jwtToken = await this.createToken(newUser._id?.toString())
            if (!jwtToken) throw new BadRequestException('Error While Creating Jwt Token')
            return jwtToken
        } catch (error) {
            this.logger.error(`An Error Occurred While Creating New User: ${error.message}`, error.stack)
            throw new InternalServerErrorException(error.message)
        }
    }

    async signIn (signInUserDto: SignInUserDto): Promise<string> {
        const { email, password } = signInUserDto
        try {
            const user = await this.userModel.findOne({email})
            if (!user) throw new NotFoundException('User Dose Not Exist / Incorrect Email ?')
            const match = await bcrypt.compare(password, user.password)
            if (!match) throw new UnauthorizedException('Incorrect Password')
            const jwtToken = await this.createToken(user._id?.toString())
            if (!jwtToken) throw new BadRequestException('Error While Creating Jwt Token')
            return jwtToken
        } catch (error) {
            this.logger.error(`An Error Occurred While Signing In: ${error.message}`, error.stack)
            throw new InternalServerErrorException(error.message)
        }
    }
}
