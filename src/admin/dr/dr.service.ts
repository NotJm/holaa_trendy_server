import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dr, DrDocument } from './schemas/dr.schema';
import { CreateDrDto } from './dto/create.dr.dto';
import { UpdateDrDto } from './dto/update.dr.dto';

@Injectable()
export class DrService {


    private increment(version: string): string {
        const [major, minor] = version.split('.').map(Number);
        return `${major + 1}.0`;
    }

    constructor(
        @InjectModel(Dr.name) private drModel: Model<DrDocument>
    ) {}


    // Metodo para crear un nuevo documento regulatorio
    async create(registerDtDto: any): Promise<any> {
        const lastDocument = await this.drModel.findOne().sort({ version: -1 }).exec();

        let new_current_version = '1.0';
        if (lastDocument) {
            new_current_version = this.increment(lastDocument.version);
        }


        const new_dr = new this.drModel({
            ...registerDtDto,
            version: new_current_version
        });

        await new_dr.save();

        return {
            status: HttpStatus.OK,
            message: "Documento Regulatorio creado"
        }

    }


    // Metodo para obtener todos los metodos regulatorios
    async find_all(): Promise<DrDocument[]> {
        return await this.drModel.find().exec()
    }


    // Metodo para eliminar (metodo logico)
    async delete(id:string): Promise<DrDocument> {
        const document = await this.drModel.findById(id).exec();

        if (!document) {
            throw new NotFoundException({
                message: `Documento regulatorio con ID: ${id} no encontrado`
            })
        }

        document.is_delete = true;

        return document.save();

    }


    // Metodo para actualizar documento
    async update(id: string, updateDrDto: UpdateDrDto): Promise<DrDocument> {
        const document = await this.drModel.findById(id).exec();

        if (!document) {
            throw new NotFoundException({
                message: `Documento regulatorio con ID: ${id} no encontrado`
            })
        }

        const new_version = this.increment(document.version);

        const update_document = new this.drModel({
            ...document.toObject(),
            ...updateDrDto,
            version: new_version,
            _id: undefined,
            create_date: Date.now(),
            update_date: Date.now(),
        })


        return await update_document.save();
    }
    

}
