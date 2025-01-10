import { HttpStatus, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private user_model: Model<UserDocument>,
  ) {
  }

  /**
   * Busca usuarios por medio de un campo o campos especificos
   * @param query Consulta a la base de datos
   * @returns Usuario con los campos especificados
   */
  find_user_by_field(query: Partial<User>): Promise<UserDocument | null> {
    if (!query || Object.keys(query).length === 0){
      throw new Error("La consulta debe tener al menos un campo")
    }
    return this.user_model.findOne(query).exec();
  }

  

  /**
   * Metodo encargado de obtener todos los usuarios con los campos "username", "email" y "verification"
   * @returns Regresa lista de usuarios con ciertos campos especificados
   */
  async get_all(): Promise<User[]> {
    return await this.user_model
      .find()
      .select('username email verification')
      .exec();
  }
}
