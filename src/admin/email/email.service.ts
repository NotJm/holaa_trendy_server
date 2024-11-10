import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailConfiguration, EmailConfiguraionDocument } from './schemas/email.config.schema';
import { Model } from 'mongoose';
import { UpdateEmailConfigurationDto } from './dto/configuration.dto';

@Injectable()
export class EmailService implements OnModuleInit {

    async onModuleInit() {
        await this.createDefaultConfiguration();
    }

    constructor(@InjectModel(EmailConfiguration.name) private readonly emailConfiguraionModel: Model<EmailConfiguraionDocument>) {}

    
    async createDefaultConfiguration(): Promise<void> {
        const existsEmailConfiguration = await this.emailConfiguraionModel.findOne().exec();

        if (!existsEmailConfiguration) {
            const defaultConfiguration = new this.emailConfiguraionModel();
            await defaultConfiguration.save() 
        }
    }
    
    async getEmailConfigurattion(): Promise<EmailConfiguraionDocument[]> {
        return this.emailConfiguraionModel.find().exec()
    }

    async updateEmailConfiguration(id: string, updateEmailConfigurationDto: UpdateEmailConfigurationDto): Promise<{ state: boolean, message: string }> {
        const emailConfiguration = await this.emailConfiguraionModel.findById(id).exec();

        if (!emailConfiguration) {
            throw new NotFoundException(
              `La configuracion con la ID ${id} no ha sido encontrada`,
            );
          }
      
          await emailConfiguration.updateOne(updateEmailConfigurationDto);
      
          await emailConfiguration.save();
      
          return {
            state: true,
            message: 'Configuracion actualizada con exito',
          };
    }

}
