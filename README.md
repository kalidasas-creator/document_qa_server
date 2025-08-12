# Document QA Server

A robust NestJS backend application designed for document ingestion, processing, and querying. This project implements a complete document management system with role-based access control and real-time processing capabilities.

## What This Project Does

Think of this as your digital document assistant - it helps you:
- Upload documents (PDFs, Word docs, etc.) for processing
- Query your documents using natural language
- Manage users with different permission levels
- Track document status in real-time
- Secure access with JWT authentication

## Architecture Overview

```
Project Structure
├── NestJS Backend (Port 3000)
│   ├── Authentication & Authorization
│   ├── Document Management
│   ├── User Management
│   ├── Webhook Integration
│   └── PostgreSQL Database
│
└── Angular Frontend (Port 4200)
    ├── Modern UI Components
    ├── Role-based Access Control
    ├── Responsive Design
    └── Real-time Updates
```

## Key Features

### Authentication & Security
- JWT-based authentication
- Role-based access control (Admin, Editor, Viewer)
- Password encryption with bcrypt
- Account activation/deactivation system

### Document Management
- Multi-format document upload
- Real-time processing status tracking
- Document querying with natural language
- Status grouping (Success, Pending, Failed)

### User Management
- User registration and onboarding
- Role assignment and management
- Account status control
- User activity tracking

### Integration
- Kafka message queuing
- Webhook callbacks for processing updates
- RESTful API with Swagger documentation
- CORS-enabled for frontend communication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd nestjs_backend_part1
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd document_rag
npm install
cd ..
```

### 3. Database Setup
Create a PostgreSQL database and update the connection settings in `src/core/config/database.config.ts`:

```typescript
{
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  // ... other settings
}
```

### 4. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT
JWT_SECRET=your_jwt_secret_key

# Kafka (if using)
KAFKA_BROKERS=localhost:9092

# Server
PORT=3000
```

### 5. Start the Application

#### Backend (NestJS)
```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

#### Frontend (Angular)
```bash
cd document_rag
ng serve
```

Your application will be available at:
- Backend API: http://localhost:3000
- Frontend: http://localhost:4200
- API Documentation: http://localhost:3000/api

## User Roles & Permissions

### Admin
- Manage all users (create, edit, delete, activate/deactivate)
- Upload documents
- View and query all documents
- Access system analytics

### Editor
- Upload documents
- View and query documents
- Manage their own uploads

### Viewer
- View and query documents
- Read-only access to the system

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/onboard` - User onboarding

### Documents
- `POST /documents/upload` - Upload document
- `GET /documents/list` - List all documents
- `POST /documents/query` - Query documents

### User Management (Admin Only)
- `GET /auth/users` - List all users
- `PUT /auth/users/:id` - Update user role/status

### Webhooks
- `POST /webhook/callback` - Processing status updates

## Development

### Project Structure
```
src/
├── core/                 # Core configurations
│   ├── config/          # Database and app configs
│   ├── guards/          # Authentication guards
│   └── decorators/      # Custom decorators
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── documents/      # Document processing
│   ├── admin/          # Admin operations
│   └── webhooks/       # Webhook handling
├── shared/             # Shared utilities
└── common/             # Common decorators
```

### Adding New Features
1. Create a new module in `src/modules/`
2. Define entities, DTOs, and services
3. Implement controllers with proper guards
4. Update the main app module
5. Add corresponding frontend components

### Code Style
- Follow NestJS best practices
- Use TypeScript strict mode
- Implement proper error handling
- Add Swagger documentation
- Write meaningful commit messages

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

## Deployment

### Production Build
```bash
# Backend
npm run build
npm run start:prod

# Frontend
cd document_rag
ng build --prod
```

### Docker (Optional)
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the API documentation at `http://localhost:3000/api`
3. Check the console logs for error details
4. Verify your database connection and environment variables

## Acknowledgments

- NestJS for the amazing backend framework
- Angular for the powerful frontend framework
- TypeORM for seamless database operations
- PostgreSQL for reliable data storage
- Kafka for message queuing (if implemented)

---

Happy coding!

*Built with love using NestJS and Angular*
