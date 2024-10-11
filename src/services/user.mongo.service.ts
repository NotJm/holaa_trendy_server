import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/interface/user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UserMongoService {

  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) { }

  async createUser(userData: IUser): Promise<IUser> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return await this.userModel.findOne({username}).exec();
  }

}
