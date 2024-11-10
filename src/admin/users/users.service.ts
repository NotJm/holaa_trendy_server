import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
    

@Injectable()
export class UsersService {
    // constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
    // async findAll() : Promise<User[]> {
    //     return await this.userModel.find().select('username email emailIsVerify').exec();
    // }
}   
