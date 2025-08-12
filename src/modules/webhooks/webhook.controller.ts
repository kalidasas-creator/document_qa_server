import { Controller, Post, Body, HttpCode, InternalServerErrorException, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly webhookService: WebhookService) {}

  @Post('callback')
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle ingestion status callbacks from Python worker' })
  @ApiQuery({ name: 'documentId', description: 'Document ID for status update' })
  @ApiBody({ schema: { example: { percent: 50, statusMessage: 'Processing...' }}})
  async handleCallback( @Body() body: any) {
    try {
      // Combine query param with body data
      console.log("Webhook body",body)
      const webhookData = {
      
        ...body
      };
      console.log({webhookData})  
      await this.webhookService.processWebhook(webhookData);
      return { status: 'received' };
    } catch (err) {
      this.logger.error(`Error processing webhook callback: ${err?.message || err}`);
      throw new InternalServerErrorException('Failed to process webhook callback');
    }
  }
}