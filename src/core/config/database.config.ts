import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'demo_user',
  password: 'admin',
  database: 'doc_rag',
  autoLoadEntities: true,
  synchronize: true,
  logging: true, // Add logging to see what SQL is being executed
};
