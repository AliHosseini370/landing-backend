import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}
  private readonly logger = new Logger(UserService.name)

  async findAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.userModel.find({}).sort({ createdAt: -1})
      if (!users || users.length === 0) throw new NotFoundException('Cant Find Any Users')
      return users
    } catch (error) {
      this.logger.error(`An Error Occurred While Getting Users: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    };
  }

  async findOneUser(id: string): Promise<User> {
    try {
      const user: User = await this.userModel.findById(id)
      if (!user) throw new NotFoundException('Cant Find This User / Incorrect Id ?')
      return user
    } catch (error) {
      this.logger.error(`An Error Occurred While Getting User: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser: User = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
      if (!updatedUser) throw new BadRequestException('Error While Updating Product')
      return updatedUser
    } catch (error) {
      this.logger.error(`An Error Occurred While Updating User: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }

  async removeUser(id: string) {
    try {
      const deletedUser: User = await this.userModel.findByIdAndDelete(id, { new: true})
      if (!deletedUser) throw new BadRequestException('Error While Deleting Product')
      return deletedUser
    } catch (error) {
      this.logger.error(`An Error Occurred While Deleting User: ${error.message}`, error.stack)
      throw new InternalServerErrorException(error.message)
    }
  }
}
