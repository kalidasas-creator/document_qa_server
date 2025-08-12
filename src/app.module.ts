import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './core/config';
import { AuthModule } from './modules/auth';
import { UserModule } from './modules/users';
import { DocumentsModule } from './modules/documents';
import { WebhookModule } from './modules/webhooks';
import { AdminModule } from './modules/admin';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    DocumentsModule,
    WebhookModule,
    AdminModule,
    TypeOrmModule.forRoot(databaseConfig),  
  ], 
})
export class AppModule {}