import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import axios from 'axios';
import FormData from 'form-data';
// import { KafkaService } from '../../shared/modules';

@Injectable()
export class DocumentsService {
  async handleUserQuery(documentId: string, query: string) {
    try {
      const payload={
        doc_id: documentId,
        query: query,
        }
        console.log("payload=",payload)
      const response = await axios.post("http://localhost:8000/query_rag", payload);

      return response.data;
    } catch (err) {
      this.logger.error(`Query failed for docId ${documentId}: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to query document: ' + (err?.message || err));
    }
  }
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
    //private readonly kafkaService: KafkaService,
  ) {}

  async handleDocumentReception(file:Express.Multer.File,body: { detail: string}) {
    try {
     
      const newDoc = this.docRepo.create({      
        ingestionStatus: 'queued',
        name:file.originalname,
        detail:body.detail,
        ingestionPercent: 0
      });
      const savedDoc = await this.docRepo.save(newDoc);     
      console.log(savedDoc.id)
      
      const form = new FormData();
    form.append('doc_id', savedDoc.id);
    form.append('webhook_url', `http://localhost:3000/webhook/callback?documentId=${savedDoc.id}`); 
    form.append('file', file.buffer, {
      filename: file.originalname || `${savedDoc.id}.pdf`,
      contentType: file.mimetype || 'application/pdf',
      knownLength: file.size,  
    });
    const res = await axios.post("http://localhost:8000/build_rag", form, {
          headers: form.getHeaders(),                 
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000,
        });

   // console.log("res=",res)
    return {documentId:savedDoc.id}
   
       
      // try {
      //   // 2. Send to Kafka
      //   //await this.kafkaService.send(process.env.KAFKA_TOPIC, body);
      // } catch (err) {
      //   this.logger.error(`Kafka send failed for docId ${body}: ${err?.message || err}`);
      //   // Update DB with failure
      //   await this.docRepo.update(
      //     { id: savedDoc.id },
      //     { ingestionStatus: 'kafka_send_failed', ingestionPercent: 0 }
      //   );
      //   throw new InternalServerErrorException('Kafka producer error: ' + (err?.message || err));
      // }
    } catch (err) {
      console.log(err)
      this.logger.error(`Reception failed for docId ${body}: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to queue document for ingestion: ' + (err?.message || err));
    }
  }

  async listDocuments() {
    try {
      const documents = await this.docRepo.find({
        order: {
          createdAt: 'DESC' // Most recent first
        }
      });
      
      // Group documents by status
      const groupedDocuments = {
        success: [],
        pending: [],
        failed: []
      };

      documents.forEach(doc => {
        const documentData = {
          id: doc.id,
          name: doc.name,
          ingestionStatus: doc.ingestionStatus,
          progress: doc.ingestionPercent,
          detail: doc.detail,
          createdAt: doc.createdAt
        };

        if (doc.ingestionStatus === 'completed' || doc.ingestionStatus === 'success') {
          groupedDocuments.success.push(documentData);
        } else if (doc.ingestionStatus === 'queued' || doc.ingestionStatus === 'started' || doc.ingestionStatus === 'pending') {
          groupedDocuments.pending.push(documentData);
        } else {
          groupedDocuments.failed.push(documentData);
        }
      });

      return {
        total: documents.length,
        success: {
          count: groupedDocuments.success.length,
          documents: groupedDocuments.success
        },
        pending: {
          count: groupedDocuments.pending.length,
          documents: groupedDocuments.pending
        },
        failed: {
          count: groupedDocuments.failed.length,
          documents: groupedDocuments.failed
        }
      };
    } catch (err) {
      this.logger.error(`Failed to list documents: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to list documents: ' + (err?.message || err));
    }
  }

  async getDocumentById(id: string) {
    try {
      return await this.docRepo.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(`Failed to get document ${id}: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to get document: ' + (err?.message || err));
    }
  }
}