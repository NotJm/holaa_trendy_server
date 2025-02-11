import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Audit, AuditDocument } from './schemas/audit.schema';
import { Model } from 'mongoose';
import { RegisterActionDto } from './dto/register.action.dto';

@Injectable()
export class AuditService {

    constructor(@InjectModel(Audit.name) private readonly auditModel: Model<AuditDocument>) {}

    // Implementacion de registro de acciones hechas por el usuario
    async registerAction(registerActionDto: RegisterActionDto): Promise<{ state: boolean, message: string }> {
        // Registrar la accion del usuario mediante la creacion de una coleccion
        const actionUser = new this.auditModel(registerActionDto);
        // Guardamos la accion del usuario
        actionUser.save();
        // Enviamos respuesta
        return { state: true, message: "Accion del usuario registrada exitosamente"}
    }

    // Metodo que se encarga de regresar todo las acciones del usuario
    async getAudit(): Promise<AuditDocument[]> {    
        return await this.auditModel.find().exec();
    }
}
