"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./src/modules/users/entities/user.entity");
const document_entity_1 = require("./src/modules/documents/entities/document.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'demo_user',
    password: 'admin',
    database: 'doc_rag',
    entities: [user_entity_1.User, document_entity_1.Document],
    synchronize: true,
    logging: true,
});
