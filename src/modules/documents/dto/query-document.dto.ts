import { ApiProperty } from '@nestjs/swagger';

export class QueryDocumentDto {
  @ApiProperty() doc_id: string;
  @ApiProperty() query: string;
}