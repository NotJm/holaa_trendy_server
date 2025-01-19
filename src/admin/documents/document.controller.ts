import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ROLE } from 'src/common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuditInterceptor } from '../../common/interceptor/audit.interceptor';
import { DrService } from './document.service';
import { CreateDocumentDto } from './dto/create.document.dto';
import { UpdateDocumentDto } from './dto/update.document.dto';


@Controller('document')
@UseInterceptors(AuditInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class DocumentController {

    constructor(private readonly documentService: DrService) {}

    @Post('create')
    @Roles(ROLE.ADMIN)
    async createDocument(@Body() creatrDocumentDto: CreateDocumentDto) {
        // Implementacion de logica para la creacion de un documento en este caso
        // se solicitan ciertos datos que viene descritos en el DTO
        return await this.documentService.createDocument(creatrDocumentDto);
    }

    @Get('get/all')
    @Roles(ROLE.ADMIN)
    async getAllDocuments() {
        // Implementacion de logica para la obtencion de todos los documentos
        // este solo se limita a obtener todos y regresarlos
        return await this.documentService.getAllDocuments(); 
    }

    @Delete('delete/:id')
    @Roles(ROLE.ADMIN)
    async deleteDocument(@Param('id') id: string) {
        // Implementacion de logica para la eliminacion, solo marcada
        // esto significa que solo se marca como eliminada mas no 
        // se elimna
        return await this.documentService.deleteDocument(id);
    }

    @Put('update/:id')
    @Roles(ROLE.ADMIN)
    async updateDocument(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        // Implementacion de actualizacion de documentos
        // esto requiere que se crea un nuevo documento apartir del actualizado
        return await this.documentService.updateDocument(id, updateDocumentDto);
    }

    @Put('activation/:id')
    @Roles(ROLE.ADMIN)
    async activationDocument(@Param('id') id: string) {
        // Activacion documento (vigente) este solo puede ser uno 
        // no puede existir varios documentos vigentes
        return await this.documentService.activationDocument(id)
        
    }

    
}
