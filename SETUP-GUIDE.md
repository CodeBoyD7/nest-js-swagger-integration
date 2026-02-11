# LMS Backend - Complete Setup & Swagger Integration Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Swagger Integration](#swagger-integration)
5. [Integrating Swagger into Existing Projects](#integrating-swagger-into-existing-projects)
6. [API Endpoints Overview](#api-endpoints-overview)
7. [Testing with Swagger](#testing-with-swagger)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed
- Git Bash or any terminal

### One-Command Setup

```bash
# 1. Navigate to project
cd "/d/nest js swagger integration"

# 2. Start databases
docker-compose up -d

# 3. Wait 10 seconds for databases to initialize
sleep 10

# 4. Install dependencies
npm install

# 5. Start the application
npm run dev
```

**Access URLs:**
- Swagger UI: http://localhost:3000/api
- API JSON: http://localhost:3000/api-json
- Health Check: http://localhost:3000/health

---

## Project Structure

```
lms-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts      # Auth endpoints (login, profile, logout)
│   │   ├── auth.service.ts         # Auth business logic
│   │   └── dto/
│   │       └── login.dto.ts        # Login DTOs with Swagger decorators
│   ├── users/
│   │   ├── users.controller.ts     # User CRUD endpoints
│   │   ├── users.service.ts        # User business logic
│   │   ├── users.module.ts         # User module
│   │   └── dto/
│   │       └── user.dto.ts         # User DTOs with validation
│   ├── courses/
│   │   ├── courses.controller.ts   # Course CRUD endpoints
│   │   ├── courses.service.ts      # Course business logic
│   │   ├── courses.module.ts       # Course module
│   │   └── dto/
│   │       └── course.dto.ts       # Course DTOs with validation
│   ├── health/
│   │   └── health.controller.ts    # Health check endpoints
│   ├── app.module.ts               # Root module
│   ├── main.ts                     # Application entry + Swagger setup
│   └── data-source.ts              # TypeORM CLI configuration
├── docker-compose.yml              # PostgreSQL + MongoDB containers
├── package.json                    # Dependencies + migration scripts
├── tsconfig.json                   # TypeScript configuration
└── .env                            # Environment variables
```

---

## Step-by-Step Setup

### Step 1: Database Setup

```bash
# Start Docker containers
docker-compose up -d

# Verify containers are running
docker-compose ps

# Expected output:
# NAME           STATUS
# lms-postgres   Up (healthy)
# lms-mongo      Up (healthy)
```

### Step 2: Environment Configuration

**File: `.env`**
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL (TypeORM)
DATABASE_URL=postgres://lms_user:lms_secure_password_2026@localhost:5432/lms_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017/lms_mongo_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Swagger Configuration
SWAGGER_TITLE=LMS API
SWAGGER_DESCRIPTION=Learning Management System REST API
SWAGGER_VERSION=1.0
SWAGGER_PATH=api
```

### Step 3: Install Dependencies

```bash
npm install
```

**Key dependencies:**
- `@nestjs/swagger` ^8.1.1 - Swagger/OpenAPI integration
- `@nestjs/platform-express` ^10.4.15 - HTTP server
- `class-validator` ^0.14.1 - DTO validation
- `class-transformer` ^0.5.1 - Object transformation

### Step 4: Start Application

```bash
# Development mode (with hot reload)
npm run dev

# Expected output:
[Nest] 12345  -  LOG [NestFactory] Starting Nest application...
[Nest] 12345  -  LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  -  LOG [InstanceLoader] MongooseModule dependencies initialized
📚 Swagger UI available at: http://localhost:3000/api
🚀 Application is running on: http://localhost:3000
```

---

## Swagger Integration

### How Swagger Works in This Project

Swagger/OpenAPI provides interactive API documentation directly from your code. Here's how it's integrated:

#### 1. Main Configuration (`src/main.ts`)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration (Development only)
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('LMS API')
      .setDescription('Learning Management System REST API')
      .setVersion('1.0')
      .setContact('Support Team', 'https://lms.example.com', 'support@lms.example.com')
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addServer('http://localhost:3000', 'Local Development')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'jwt-auth',
      )
      .addTag('Authentication', 'User authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Courses', 'Course management endpoints')
      .addTag('Health', 'System health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,  // Token persists after refresh
        tryItOutEnabled: true,       // Auto-enable try-it-out
        docExpansion: 'list',        // Expand all endpoints
        filter: true,                // Enable search
        showRequestDuration: true,   // Show request time
        tagsSorter: 'alpha',         // Sort tags alphabetically
        operationsSorter: 'alpha',   // Sort operations alphabetically
      },
      customSiteTitle: 'LMS API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  await app.listen(3000);
}
bootstrap();
```

#### 2. Controller-Level Decorators

**Authentication Controller Example:**

```typescript
import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')  // Groups under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      'Default User': {
        value: { email: 'user@example.com', password: 'password123' },
      },
      'Admin User': {
        value: { email: 'admin@lms.com', password: 'admin123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth('jwt-auth')  // Requires JWT authentication
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved', type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile() {
    return this.authService.getProfile();
  }
}
```

#### 3. DTO-Level Decorators

**Login DTO Example:**

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
    minLength: 6,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      role: { type: 'string', example: 'student' },
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
```

---

## Integrating Swagger into Existing Projects

### Step-by-Step Integration Guide

#### Step 1: Install Dependencies

```bash
npm install @nestjs/swagger
```

#### Step 2: Update `main.ts`

Add Swagger configuration to your main.ts:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Your API Name')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .addBearerAuth()  // If using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // Serve at /api

  await app.listen(3000);
}
bootstrap();
```

#### Step 3: Add Decorators to Controllers

**Before (No Swagger):**
```typescript
@Controller('users')
export class UsersController {
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

**After (With Swagger):**
```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()  // If authentication required
@Controller('users')
export class UsersController {
  
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

#### Step 4: Add Decorators to DTOs

**Before (No Swagger):**
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**After (With Swagger):**
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
```

#### Step 5: Verify Installation

1. Start your application: `npm run start:dev`
2. Open browser: `http://localhost:3000/api`
3. You should see the Swagger UI with all documented endpoints

---

## Swagger Decorators Quick Reference

### Class-Level Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiTags('name')` | Group endpoints | `@ApiTags('Users')` |
| `@ApiBearerAuth()` | Require JWT auth | `@ApiBearerAuth('jwt-auth')` |

### Method-Level Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiOperation()` | Describe endpoint | `@ApiOperation({ summary: 'Get user' })` |
| `@ApiResponse()` | Document response | `@ApiResponse({ status: 200, type: UserDto })` |
| `@ApiParam()` | URL parameter | `@ApiParam({ name: 'id', example: 1 })` |
| `@ApiQuery()` | Query parameter | `@ApiQuery({ name: 'search', required: false })` |
| `@ApiBody()` | Request body | `@ApiBody({ type: CreateUserDto })` |

### Property-Level Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiProperty()` | Document property | `@ApiProperty({ example: 'John' })` |
| `@ApiPropertyOptional()` | Optional property | `@ApiPropertyOptional({ description: 'Bio' })` |

---

## API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/login` | ❌ | Login with email/password |
| GET | `/auth/profile` | ✅ | Get current user profile |
| POST | `/auth/logout` | ✅ | Logout user |

**Demo Credentials:**
- `user@example.com` / `password123` (Student)
- `admin@lms.com` / `admin123` (Admin)
- `instructor@lms.com` / `instructor123` (Instructor)

### Users Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/users` | ✅ | List all users (paginated) |
| GET | `/users/:id` | ✅ | Get user by ID |
| POST | `/users` | ✅ | Create new user |
| PATCH | `/users/:id` | ✅ | Update user |
| DELETE | `/users/:id` | ✅ | Delete user |

**Query Parameters:**
- `search` - Search by name/email
- `role` - Filter by role (student/instructor/admin)
- `status` - Filter by status (active/inactive/suspended)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Courses Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/courses` | ✅ | List all courses (paginated) |
| GET | `/courses/:id` | ✅ | Get course by ID |
| POST | `/courses` | ✅ | Create new course |
| PATCH | `/courses/:id` | ✅ | Update course |
| DELETE | `/courses/:id` | ✅ | Delete course |

**Query Parameters:**
- `search` - Search by title/description
- `level` - Filter by level (beginner/intermediate/advanced)
- `status` - Filter by status (draft/published/archived)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `instructorId` - Filter by instructor
- `page` - Page number
- `limit` - Items per page

### Health Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/health` | ❌ | Basic health check |
| GET | `/health/ready` | ❌ | Readiness check |

---

## Testing with Swagger

### Step 1: Access Swagger UI

Open your browser: http://localhost:3000/api

### Step 2: Login

1. Find **Authentication** section
2. Click on `POST /auth/login`
3. Click **Try it out**
4. Use demo credentials:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
5. Click **Execute**
6. Copy the `access_token` from response

### Step 3: Authorize

1. Click **Authorize** button (🔓 lock icon, top right)
2. Enter: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your token)
3. Click **Authorize**
4. Click **Close**

### Step 4: Test Protected Endpoints

Now you can test any endpoint:

**Get All Users:**
```
GET /users?page=1&limit=10
```

**Create a Course:**
```
POST /courses
Body:
{
  "title": "New Course",
  "description": "Course description",
  "level": "beginner",
  "duration": 10,
  "price": 49.99,
  "tags": ["javascript", "web"]
}
```

**Filter Courses:**
```
GET /courses?level=beginner&maxPrice=100&status=published
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `ECONNREFUSED: Connection refused to postgres:5432`

**Solution:**
```bash
# Check if containers are running
docker-compose ps

# If not running, start them
docker-compose up -d

# Wait 10 seconds for initialization
sleep 10

# Check logs
docker-compose logs postgres
docker-compose logs mongo
```

### Swagger Not Loading

**Error:** `Cannot GET /api`

**Solution:**
```bash
# Check NODE_ENV
cat .env | grep NODE_ENV
# Should be: NODE_ENV=development

# Restart application
npm run dev
```

### JWT Token Not Working

**Error:** `401 Unauthorized`

**Solution:**
1. Make sure you're using the format: `Bearer your_token_here`
2. Token expires in 7 days by default
3. Re-login to get a fresh token
4. Click **Authorize** again with new token

### TypeScript Compilation Errors

**Solution:**
```bash
# Clean and rebuild
rm -rf dist
npm run build
npm run dev
```

### Port Already in Use

**Error:** `EADDRINUSE: Port 3000 already in use`

**Solution:**
```bash
# Windows
npx kill-port 3000

# Or change port in .env
PORT=3001
```

### Migration Issues

**Error:** `Missing script "migration:run"`

**Solution:** Already fixed in package.json:
```json
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "migration:run": "npm run typeorm migration:run -- -d ./src/data-source.ts",
    "migration:generate": "npm run typeorm migration:generate -- -d ./src/data-source.ts",
    "migration:create": "npm run typeorm migration:create",
    "migration:revert": "npm run typeorm migration:revert -- -d ./src/data-source.ts"
  }
}
```

---

## Advanced Configuration

### Custom Swagger Theme

Update `main.ts`:
```typescript
SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    docExpansion: 'none',  // 'list' | 'full' | 'none'
    filter: true,
    showRequestDuration: true,
  },
  customSiteTitle: 'Your API Title',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
  `,
  customfavIcon: '/favicon.ico',
});
```

### Multiple API Versions

```typescript
// Create versioned document
const v1Config = new DocumentBuilder()
  .setTitle('API v1')
  .setVersion('1.0')
  .build();

const v2Config = new DocumentBuilder()
  .setTitle('API v2')
  .setVersion('2.0')
  .build();

SwaggerModule.setup('api/v1', app, SwaggerModule.createDocument(app, v1Config));
SwaggerModule.setup('api/v2', app, SwaggerModule.createDocument(app, v2Config));
```

### Export OpenAPI JSON

```typescript
// Generate static JSON file
const fs = require('fs');
const document = SwaggerModule.createDocument(app, config);
fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
```

---

## Best Practices

1. **Always use DTOs** - Document request/response types properly
2. **Add examples** - Help frontend developers understand expected data
3. **Document errors** - Add `@ApiResponse` for all error cases (400, 401, 404, 500)
4. **Use tags** - Group related endpoints logically
5. **Keep it updated** - Update Swagger docs when API changes
6. **Use validation** - Combine class-validator with @ApiProperty
7. **Secure sensitive endpoints** - Use @ApiBearerAuth for protected routes
8. **Version your API** - Use API versioning for breaking changes

---

## Useful Commands

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Build for production
npm run start:prod       # Start production build

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests

# Linting
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Database
npm run migration:run    # Run pending migrations
npm run migration:generate -- src/migrations/Name  # Generate migration

# Docker
docker-compose up -d     # Start databases
docker-compose down      # Stop databases
docker-compose down -v   # Stop and remove data
```

---

## Summary

✅ **Setup Complete!** You now have:
- Working NestJS backend with PostgreSQL & MongoDB
- Interactive Swagger UI at `/api`
- JWT authentication with Bearer tokens
- Full CRUD endpoints for Users & Courses
- Comprehensive API documentation
- Easy testing interface

**Next Steps:**
1. Open http://localhost:3000/api
2. Login with demo credentials
3. Test all endpoints
4. Start building your frontend!

---

**Need Help?** Check the Swagger Guide: `SWAGGER-GUIDE.md`
