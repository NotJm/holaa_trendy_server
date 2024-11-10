import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentRegulatory, DrDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create.document.dto';
import { UpdateDocumentDto } from './dto/update.document.dto';

@Injectable()
export class DrService {


    private increment(version: string): string {
        const [major] = version.split('.').map(Number);
        return `${major + 1}.0`;
    }

    constructor(
        @InjectModel(DocumentRegulatory.name) private documentModel: Model<DrDocument>
    ) {}


    // Implementacion para la creacion de un documento regulatorio 
    // Este ocupa totalmente el dto paral creacion de un documento
    async createDocument(createDocumentoDto: CreateDocumentDto ): Promise<{ state: boolean }> {

        // Primero ordenamos mediante las versiones mas viejas
        const lastDocument = await this.documentModel.findOne().sort({ version: -1 }).exec();

        // Creamos una variable para el manejo de las versiones
        let new_current_version = '1.0';

        // Obtenemos el ultimo documento e incrementamos la version
        if (lastDocument) {
            new_current_version = this.increment(lastDocument.version);
        }

        createDocumentoDto.version = new_current_version;

        // Creamos el documento
        const newDocument = new this.documentModel(createDocumentoDto);

        // Guardando datos
        await newDocument.save();

        // Regresamos que se creo con exito
        return { state: true }

    }


    // Metodo para obtener todos los metodos regulatorios
    async getAllDocuments(): Promise<DrDocument[]> {
        // Regresamos todos los documentos regulatorios existentes
        return await this.documentModel.find().exec()
    }


    // Implementacion de eliminacion (de manera logica) esto quiere decir
    // que el documento solo marca eliminado pero como tal no se elimina de la 
    // base de datos
    async deleteDocument(id:string): Promise<{ state: boolean }> {

        // Busca documento dentro de la base de datos
        const document = await this.documentModel.findById(id);

        // Si el documento no existen envia un error de no encontrado
        if (!document) {
            throw new NotFoundException({
                message: `Documento regulatorio con ID: ${id} no encontrado`
            })
        }

        // Pasamos el documento como eliminado logicamente hablando
        document.isDelete = true;

        await document.save();

        // Regresamos operacion exitosa
        return { state: true }

    }


    // Implementacion de actualizacion de documento regulatorio
    // cada documento regulatorio actualizado crea una nueva version
    // manteniendo un historial de versiones
    async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto): Promise<{ state: true }> {
        // Buscamos elemento en la base de datos
        const document = await this.documentModel.findById(id).exec();

        // Si no encontramos el documento en la base de datos
        // enviamos un erro de no encontrado
        if (!document) {
            throw new NotFoundException({
                message: `Documento regulatorio con ID: ${id} no encontrado`
            })
        }

        // Creamos una nueva version incrementando la que queremos modificar
        const newVersion = this.increment(document.version);

        const updateDocument = new this.documentModel({
            ...document.toObject(),
            ...updateDocumentDto,
            _id: undefined,
            version: newVersion,
            create_date: document.create_date,
            update_date: Date.now(),
        })

        await updateDocument.save();

        return { state: true } 
    }

    // Implementacion de metodo para la activacion de documento (vigente)
    async activationDocument(id: string) : Promise<{ state: boolean }> {
        // Buscamos documento que sea el vigente, si existe un documento 
        // ya vigente se tiene que marcar el nuevo como vigente y el anterior ya no
        const currentDocument = await this.documentModel.findOne({ current: true }).exec();

        // Buscamos el documento que se quiere activar
        const document = await this.documentModel.findById(id).exec();

        // Si no encontramos el documento en la base de datos
        // enviamos un erro de no encontrado
        if (!document) {
            throw new NotFoundException({
                message: `Documento regulatorio con ID: ${id} no encontrado`
            })
        }

        if (document.isDelete) {
            throw new ConflictException({
                message: "El documento regulatorio que quiere activar se encuentra marcado como eliminado"
            })
        }

        if (!currentDocument) {
            // Cambiamos al documento nuevo como vigente
            document.current = true;
        } else {
            // Quitamos al documento ya existente como vigente y se lo damos al nuevo
            currentDocument.current = false;
            document.current = true;
            
        }

        await currentDocument.save();

        await document.save();

        return { state: true }
    }
    
}
