import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
  ) {}

  async processWebhook(data: { documentId: string; percent: number; statusMessage: string }) {
    this.logger.log(`Received status for doc ${data.documentId}: ${data.percent}% - ${data.statusMessage}`);
    try {
      await this.docRepo.update(
        { id: data.documentId },
        { ingestionPercent: data.percent, ingestionStatus: data.statusMessage }
      );

      // If failed, handle accordingly
      if (data.statusMessage.toLowerCase().includes('failed')) {
        this.logger.error(`Ingestion FAILED for docId ${data.documentId}: ${data.statusMessage}`);
        throw new InternalServerErrorException(`Ingestion failed for docId ${data.documentId}: ${data.statusMessage}`);
      }

      if (data.percent === 100 && data.statusMessage === 'Ingestion complete') {
        this.logger.log('Triggering downstream process for docId ' + data.documentId);
        // e.g., send Kafka event, notify user, etc.
      }
    } catch (err) {
      this.logger.error(`Error updating doc status or downstream process: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to update document status');
    }
  }
}