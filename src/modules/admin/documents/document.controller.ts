import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ROLE } from 'src/common/constants/contants';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../../common/guards/role.guard';
import { RegulatoryDocumentService } from './document.service';
import { CreateRegulatoryDocumentDto } from './dtos/create.document.dto';
import { UpdateRegulatoryDocumentDto } from './dtos/update.document.dto';


@Controller('document')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.ADMIN)
export class DocumentController {

    constructor(private readonly documentService: RegulatoryDocumentService) {}

    @Post('create')
    async createDocument(@Body() creatrDocumentDto: CreateRegulatoryDocumentDto) {
        // Implementacion de logica para la creacion de un documento en este caso
        // se solicitan ciertos datos que viene descritos en el DTO
        // return await this.documentService.createDocument(creatrDocumentDto);
    }

    @Get('get/all')
    async getAllDocuments() {
        // Implementacion de logica para la obtencion de todos los documentos
        // este solo se limita a obtener todos y regresarlos
        // return await this.documentService.getAllDocuments(); 
    }

    @Delete('delete/:id')
    async deleteDocument(@Param('id') id: string) {
        // Implementacion de logica para la eliminacion, solo marcada
        // esto significa que solo se marca como eliminada mas no 
        // se elimna
        // return await this.documentService.deleteDocument(id);
    }

    @Put('update/:id')
    async updateDocument(@Param('id') id: string, @Body() updateDocumentDto: UpdateRegulatoryDocumentDto) {
        // Implementacion de actualizacion de documentos
        // esto requiere que se crea un nuevo documento apartir del actualizado
        // return await this.documentService.updateDocument(id, updateDocumentDto);
    }

    @Put('activation/:id')
    async activationDocument(@Param('id') id: string) {
        // Activacion documento (vigente) este solo puede ser uno 
        // no puede existir varios documentos vigentes
        // return await this.documentService.activationDocument(id)
        
    }

    
}
