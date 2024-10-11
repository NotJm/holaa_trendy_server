import { Injectable } from '@nestjs/common';
import { IUser } from 'src/interface/user.interface';
import { UserMongoService } from 'src/services/user.mongo.service';

@Injectable()
export class AuthService {
  constructor(private userMongoService: UserMongoService) {}

  async login(userData: IUser): Promise<any> {
    const user = await this.userMongoService.findUserByUsername(userData.username);

    if(!user || user.password !== userData.password){
        throw new Error('Error credenciales incorrectas');
    }

    return { message: 'Login con exito', user};
  }

  // Logica para el registro de usuario
  async register(userData: IUser): Promise<any> {
    const existingUser = await this.userMongoService.findUserByUsername(
      userData.username,
    );

    if (existingUser) {
      throw new Error('El usuario ya se encuentra registrado');
    }

    const newUser = await this.userMongoService.createUser(userData);
    return newUser;
  }
  
}
