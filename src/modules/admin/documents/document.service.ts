import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegulatoryDocumentDto } from './dtos/create.document.dto';
import { UpdateRegulatoryDocumentDto } from './dtos/update.document.dto';
import { RegulatoryDocument } from './entity/regulatory-document.entity';
import { BaseService } from '../../../common/base.service';
@Injectable()
export class RegulatoryDocumentService extends BaseService<RegulatoryDocument> {
  constructor(
    @InjectRepository(RegulatoryDocument)
    private readonly regulatoryDocumentRepository: Repository<RegulatoryDocument>,
  ) {
    super(regulatoryDocumentRepository);
  }

  private async findRegulatoryDocumentById(
    id: string,
  ): Promise<RegulatoryDocument> {
    const document = await this.findById(id);

    if (!document) {
      throw new NotFoundException('No se encontro el documento regulatorio');
    }

    return document;
  }

  private async findLastRegulatoryDocument(): Promise<RegulatoryDocument> {
    const document = await this.findOne({
      order: {
        version: 'DESC',
      },
    });

    if (!document) {
      throw new NotFoundException('No se encontro el documento regulatorio');
    }

    return document;
  }

  private increaseVersion(version: string): string {
    const [major] = version.split('.').map(Number);
    return `${major + 1}.0`;
  }

  async createOne(
    createRegulatoryDocument: CreateRegulatoryDocumentDto,
  ): Promise<void> {
    const lastDocument = await this.findLastRegulatoryDocument();
  }

  // Implementacion para la creacion de un documento regulatorio
  // // Este ocupa totalmente el dto paral creacion de un documento
  // async createDocument(
  //   createDocumentoDto: CreateRegulatoryDocumentDto,
  // ): Promise<{ state: boolean; message: string }> {
  //   // Primero ordenamos mediante las versiones mas viejas
  //   const lastDocument = await this.documentModel
  //     .findOne()
  //     .sort({ version: -1 })
  //     .exec();

  //   // Creamos una variable para el manejo de las versiones
  //   let new_current_version = '1.0';

  //   // Obtenemos el ultimo documento e incrementamos la version
  //   if (lastDocument) {
  //     new_current_version = this.increaseVersion(lastDocument.version);
  //   }

  //   createDocumentoDto.version = new_current_version;

  //   // Creamos el documento
  //   const newDocument = new this.documentModel(createDocumentoDto);

  //   // Guardando datos
  //   await newDocument.save();

  //   // Regresamos que se creo con exito
  //   return {
  //     state: true,
  //     message: 'Documento creado con exito',
  //   };
  // }

  // // Metodo para obtener todos los metodos regulatorios
  // async getAllDocuments(): Promise<DrDocument[]> {
  //   // Regresamos todos los documentos regulatorios existentes
  //   return await this.documentModel.find().exec();
  // }

  // // Implementacion de eliminacion (de manera logica) esto quiere decir
  // // que el documento solo marca eliminado pero como tal no se elimina de la
  // // base de datos
  // async deleteDocument(
  //   id: string,
  // ): Promise<{ state: boolean; message: string }> {
  //   // Busca documento dentro de la base de datos
  //   const document = await this.documentModel.findById(id);

  //   // Si el documento no existen envia un error de no encontrado
  //   if (!document) {
  //     throw new NotFoundException({
  //       message: `Documento regulatorio con ID: ${id} no encontrado`,
  //     });
  //   }

  //   // Pasamos el documento como eliminado logicamente hablando
  //   document.isDelete = true;

  //   await document.save();

  //   // Regresamos operacion exitosa
  //   return {
  //     state: true,
  //     message: 'Documento eliminado con exito',
  //   };
  // }

  // // Implementacion de actualizacion de documento regulatorio
  // // cada documento regulatorio actualizado crea una nueva version
  // // manteniendo un historial de versiones
  // async updateDocument(
  //   id: string,
  //   updateDocumentDto: UpdateRegulatoryDocumentDto,
  // ): Promise<{ state: true }> {
  //   // Buscamos elemento en la base de datos
  //   const document = await this.documentModel.findById(id).exec();

  //   // Si no encontramos el documento en la base de datos
  //   // enviamos un erro de no encontrado
  //   if (!document) {
  //     throw new NotFoundException({
  //       message: `Documento regulatorio con ID: ${id} no encontrado`,
  //     });
  //   }

  //   // Creamos una nueva version incrementando la que queremos modificar
  //   const newVersion = this.increaseVersion(document.version);

  //   document.current = false;

  //   await document.save();

  //   const updateDocument = new this.documentModel({
  //     ...document.toObject(),
  //     ...updateDocumentDto,
  //     _id: undefined,
  //     version: newVersion,
  //     current: true,
  //     create_date: document.create_date,
  //     update_date: new Date(),
  //   });

  //   await updateDocument.save();

  //   return { state: true };
  // }

  // // Implementacion de metodo para la activacion de documento (vigente)
  // async activationDocument(
  //   id: string,
  // ): Promise<{ state: boolean; message: string }> {
  //   // Buscamos documento que sea el vigente, si existe un documento
  //   // ya vigente se tiene que marcar el nuevo como vigente y el anterior ya no
  //   const currentDocument = await this.documentModel
  //     .findOne({ current: true })
  //     .exec();

  //   // Buscamos el documento que se quiere activar
  //   const document = await this.documentModel.findById(id).exec();

  //   // Si no encontramos el documento en la base de datos
  //   // enviamos un erro de no encontrado
  //   if (!document) {
  //     throw new NotFoundException({
  //       message: `Documento regulatorio con ID: ${id} no encontrado`,
  //     });
  //   }

  //   if (document.isDelete) {
  //     throw new ConflictException({
  //       message:
  //         'El documento regulatorio que quiere activar se encuentra marcado como eliminado',
  //     });
  //   }

  //   if (!currentDocument) {
  //     // Cambiamos al documento nuevo como vigente
  //     document.current = true;
  //   } else {
  //     // Quitamos al documento ya existente como vigente y se lo damos al nuevo
  //     currentDocument.current = false;
  //     document.current = true;

  //     await currentDocument.save();
  //   }

  //   await document.save();

  //   return {
  //     state: true,
  //     message: 'Documento marcado como vigente con exito',
  //   };
  // }
}
