import { Controller, Post, Body, UseGuards, HttpCode, BadRequestException, UseInterceptors, UploadedFile, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @HttpCode(202)
  @ApiOperation({ summary: 'Receive document info and produce to Kafka for ingestion' })
  @ApiBody({ type: UploadDocumentDto })
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 25 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const ok = file.mimetype === 'application/pdf';
      cb(ok ? null : new BadRequestException('Only PDF allowed'), ok);
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File,@Body() body: UploadDocumentDto) {
    try {
     
      const response:{documentId:string}=await this.documentsService.handleDocumentReception(file,body);
      
      return { status: 'queued', docId: response.documentId };
    } catch (err) {
      console.log(err)
      throw new BadRequestException(err?.message || err); 
    }
  }

  @Get('query')
  @ApiOperation({ summary: 'Receive user query with document ID' })
  @ApiQuery({ name: 'documentId', type: String, required: true, description: 'ID of the document' })
  @ApiQuery({ name: 'query', type: String, required: true, description: 'User query' })
  @ApiResponse({ status: 200, description: 'Query processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Roles('admin', 'editor', 'viewer')
  async queryDocument(@Query('documentId') documentId: string, @Query('query') query: string) {
    try {
      const result = await this.documentsService.handleUserQuery(documentId, query);
      return { status: 'success', data: result };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err); 
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all documents with their ingestion status' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles('admin', 'editor', 'viewer')
  async listDocuments() {
    try {
      const result = await this.documentsService.listDocuments();
      return { 
        status: 'success', 
        ...result
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err); 
    }
  }
}

