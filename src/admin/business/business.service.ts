import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocialSite, SocialSiteDocument } from './schemas/social.sites.schema';
import { Model } from 'mongoose';
import { CreateSocialSiteDto } from './dto/social/create.social.dto';
import { updateSocialSiteDto } from './dto/social/update.social.dto';
import { CreateBusinessProfileDto, UpdtaeBusinessProfileDto } from './dto/business/business.dto';
import { Business, BusinessDocument } from './schemas/business.schema';

@Injectable()
export class BusinessService {
    constructor(
        @InjectModel(SocialSite.name) private readonly socialSiteModel: Model<SocialSiteDocument>,
        @InjectModel(Business.name) private readonly businessSiteModel: Model<BusinessDocument>
    ) {}

    // Implementacion de metodo para la creacion una red social 
    // mediante la estructura de datos DTO
    async creatSocialSite(createSocialSiteDto: CreateSocialSiteDto): Promise<{ state: boolean, message: string }> {
        const { name } = createSocialSiteDto;
        // Primero verificamos que no exista una red social con el mismo nombre
        const socialSite = await this.socialSiteModel.findOne({ name }).exec();

        // Si existe con el mismo nombre enviamos un informe al administrador
        if (socialSite) {
            throw new ConflictException({
                message: `Se ha encontrado una red social con el mismo nombre "${name}"`
            })
        }

        // Si no existe ahora empezamos a crear la red social
        const newSocialSite = new this.socialSiteModel(createSocialSiteDto)

        // Guardamos en la base de datos
        newSocialSite.save();

        // Regresams respuesta
        return { 
            state: true,
            message: "Se ha creado con exito la red social"
         }
    }

    // Implementacion de metodo para la obtencion de todas las redes sociales
    async getSocialSites(): Promise<SocialSiteDocument[]> {
        return await this.socialSiteModel.find().exec()
    }

    // Implementacion de metodo para la actualizacion de una red social
    // mediante la estructura de datos DTO previamente programada
    async updateSocialSite(id:string, updateSocialSiteDto: updateSocialSiteDto): Promise<{ state: boolean, message: string }> {
        // Primero verificamos que realmente exista la red social con ese ID
        const socialSite = await this.socialSiteModel.findById(id).exec()

        // Si no existiera mandamos un mensaje de informacion
        if (!socialSite) {
            throw new NotFoundException({
                message: `No se ha encontrado la red social con el ID: ${id} en la base de datos`
            })
        }

        // Si existiera entonces hacemos las actualizaciones correspondientes
        socialSite.updateOne({
            ...updateSocialSiteDto,
            update_date: new Date()
        }).exec();

        // Regresamos el indicador que la operacion fue exitosa
        return { 
            state: true,
            message: "Se ha actualizado con exito la red social"
        }

    }

    // Implementacion de metodo para la eliminacion de red social en la base de datos
    // mediante la estructura de datos DTO previamente programada
    async deleteSocialSite(id: string): Promise<{ state: boolean, message: string }> {
        // Primero verificamos que relamnete existe la red social asociada con la ID
        const socialSite = await this.socialSiteModel.findById(id).exec()

        if(!socialSite) {
            throw new NotFoundException({
                message: `No se ha encontrado la red social asociada con la ID: ${id} en la base de datos`
            })
        }

        // Si existe procedemos a eliminar la red social de la base de datos
        socialSite.deleteOne().exec()

        // Regresamos que la operacion se realizo de manera exitosa
        return { 
            state: true,
            message: "Red Social eliminada con exito"
        }
    }

    // Implementacion de metodo para obtener la informacion total de la empresa
    async getBusinessInformation(): Promise<BusinessDocument> {
        return await this.businessSiteModel.findOne().exec();
    }

    // Implementacion de creacion del perfil de la empresa
    async createBusinessProfile(businessDto: CreateBusinessProfileDto): Promise<{ state: boolean, message: string }> {
        // Verificamos si ya existe el perfil de la empresa 
        const existsProfile = await this.businessSiteModel.findOne().exec();

        if (!existsProfile) {
            // Creamos el documento para el nuevo perfil de la empresa
            const createProfile = new this.businessSiteModel(businessDto);

            // Guardamos sel perfil
            createProfile.save();

            return { state: true, message: "Perfil de la empresa creado exitosamente" }
        } else {
            return { state: false, message: "El perfil de la empresa ya ha sido creado"}
        }
    }

    // Implementacion de actualizacion de perfil de la empresa
    async updateBusinessProfile(id: string, updateBusinessProfile: UpdtaeBusinessProfileDto): Promise<{ state: boolean, message: string}> {
        // Verificamos si ya existe el perfil de la empresa
        const existsProfile = await this.businessSiteModel.findById(id).exec();

        if (!existsProfile) {
            return { state: false, message: "El perfil de la empresa no ha sido creado o eliminado"}
        } else {
            existsProfile.updateOne({
                ...updateBusinessProfile,
                update_date: new Date()
            }).exec();

            return { state: true, message: "El perfil de la empresa ha sido actualizado exitosamente"}
        }
    }

}
