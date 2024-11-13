import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { DrService } from './document.service';
import { CreateDocumentDto as CreateDocumentDto } from './dto/create.document.dto';
import { UpdateDocumentDto } from './dto/update.document.dto';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { Role } from 'src/constants/contants';
import { RoleGuard } from '../../core/guards/role.guard';
import { AuditInterceptor } from '../../core/interceptor/audit.interceptor';


@Controller('document')
@UseInterceptors(AuditInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class DocumentController {

    constructor(private readonly documentService: DrService) {}

    @Post('create')
    @Roles(Role.ADMIN)
    async createDocument(@Body() creatrDocumentDto: CreateDocumentDto) {
        // Implementacion de logica para la creacion de un documento en este caso
        // se solicitan ciertos datos que viene descritos en el DTO
        return await this.documentService.createDocument(creatrDocumentDto);
    }

    @Get('get/all')
    @Roles(Role.ADMIN)
    async getAllDocuments() {
        // Implementacion de logica para la obtencion de todos los documentos
        // este solo se limita a obtener todos y regresarlos
        return await this.documentService.getAllDocuments(); 
    }

    @Delete('delete/:id')
    @Roles(Role.ADMIN)
    async deleteDocument(@Param('id') id: string) {
        // Implementacion de logica para la eliminacion, solo marcada
        // esto significa que solo se marca como eliminada mas no 
        // se elimna
        return await this.documentService.deleteDocument(id);
    }

    @Put('update/:id')
    @Roles(Role.ADMIN)
    async updateDocument(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        // Implementacion de actualizacion de documentos
        // esto requiere que se crea un nuevo documento apartir del actualizado
        return await this.documentService.updateDocument(id, updateDocumentDto);
    }

    @Put('activation/:id')
    @Roles(Role.ADMIN)
    async activationDocument(@Param('id') id: string) {
        // Activacion documento (vigente) este solo puede ser uno 
        // no puede existir varios documentos vigentes
        return await this.documentService.activationDocument(id)
        
    }

    
}
