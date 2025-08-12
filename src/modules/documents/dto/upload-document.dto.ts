import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty() detail: string;
}