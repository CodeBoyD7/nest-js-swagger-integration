# Complete Swagger Implementation Guide

## Overview
This project now has comprehensive Swagger/OpenAPI documentation with the following features:

### Features Added:
✅ JWT Bearer Authentication  
✅ API Versioning (v1)  
✅ Request/Response DTOs with validation  
✅ Comprehensive error responses  
✅ Query parameters with examples  
✅ Health check endpoints  
✅ CORS enabled  
✅ UI Customization (removed top bar, persist auth)  

---

## All Swagger Decorators Used

### 1. **Class-Level Decorators**

#### `@ApiTags('Tag Name')`
Groups endpoints in the Swagger UI sidebar.
```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {}
```

#### `@ApiBearerAuth('jwt-auth')`
Marks all endpoints in controller as requiring JWT authentication.
```typescript
@ApiBearerAuth('jwt-auth')
@Controller('users')
export class UsersController {}
```

---

### 2. **Method-Level Decorators**

#### `@ApiOperation()`
Describes what the endpoint does.
```typescript
@ApiOperation({
  summary: 'Get all users',
  description: 'Retrieve a paginated list of users with optional filtering',
})
@Get()
async findAll() {}
```

#### `@ApiResponse()`
Documents possible responses.
```typescript
@ApiResponse({
  status: 200,
  description: 'Login successful',
  type: LoginResponseDto,
})
@ApiResponse({
  status: 401,
  description: 'Invalid credentials',
  type: ErrorResponseDto,
})
@Post('login')
async login() {}
```

#### `@ApiParam()`
Documents URL parameters.
```typescript
@ApiParam({
  name: 'id',
  description: 'User ID',
  example: 1,
  type: 'number',
})
@Get(':id')
async findOne(@Param('id') id: number) {}
```

#### `@ApiQuery()`
Documents query parameters.
```typescript
@ApiQuery({
  name: 'search',
  required: false,
  description: 'Search by name or email',
  example: 'john',
})
@ApiQuery({
  name: 'role',
  required: false,
  enum: UserRole,
  description: 'Filter by user role',
})
@Get()
async findAll(@Query() query: QueryUserDto) {}
```

#### `@ApiBody()`
Documents request body with examples.
```typescript
@ApiBody({
  type: LoginDto,
  description: 'Login credentials',
  examples: {
    'Default User': {
      value: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
    'Admin User': {
      value: {
        email: 'admin@lms.com',
        password: 'admin123',
      },
    },
  },
})
@Post('login')
async login(@Body() loginDto: LoginDto) {}
```

---

### 3. **Property-Level Decorators (DTOs)**

#### `@ApiProperty()` - Basic
```typescript
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;
}
```

#### `@ApiProperty()` with Enum
```typescript
export class CreateUserDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.STUDENT,
    required: true,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
```

#### `@ApiPropertyOptional()`
```typescript
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
```

#### `@ApiProperty()` with Array Type
```typescript
export class CreateCourseDto {
  @ApiProperty({
    description: 'Course tags',
    example: ['nestjs', 'backend', 'typescript'],
    type: [String],  // Note: [String] not just String
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

#### `@ApiProperty()` with Nested Object
```typescript
export class CourseResponseDto {
  @ApiProperty({
    description: 'Instructor information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 2 },
      name: { type: 'string', example: 'Jane Smith' },
      email: { type: 'string', example: 'instructor@lms.com' },
    },
  })
  instructor: {
    id: number;
    name: string;
    email: string;
  };
}
```

#### `@ApiProperty()` with Schema
```typescript
@ApiResponse({
  status: 200,
  description: 'API is healthy',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      timestamp: { type: 'string', example: '2026-02-11T10:00:00.000Z' },
      uptime: { type: 'number', example: 12345 },
      version: { type: 'string', example: '1.0.0' },
    },
  },
})
```

---

### 4. **Main.ts Swagger Configuration**

```typescript
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
  .build();

SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,  // Keeps auth after refresh
    tryItOutEnabled: true,       // Enables "Try it out" by default
    docExpansion: 'list',        // Expands all endpoints
    filter: true,                // Enables search box
    showRequestDuration: true,   // Shows request time
    tagsSorter: 'alpha',         // Sorts tags alphabetically
    operationsSorter: 'alpha',   // Sorts operations alphabetically
  },
  customSiteTitle: 'LMS API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',  // Hides Swagger logo
});
```

---

## Available Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /auth/login | No | Login with email/password |
| GET | /auth/profile | Yes | Get current user profile |
| POST | /auth/logout | Yes | Logout user |

### Users (`/users`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /users | Yes | List all users (paginated) |
| GET | /users/:id | Yes | Get user by ID |
| POST | /users | Yes | Create new user |
| PATCH | /users/:id | Yes | Update user |
| DELETE | /users/:id | Yes | Delete user |

### Courses (`/courses`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /courses | Yes | List all courses (paginated) |
| GET | /courses/:id | Yes | Get course by ID |
| POST | /courses | Yes | Create new course |
| PATCH | /courses/:id | Yes | Update course |
| DELETE | /courses/:id | Yes | Delete course |

### Health (`/health`)
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /health | No | Basic health check |
| GET | /health/ready | No | Readiness check |

---

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| user@example.com | password123 | student |
| admin@lms.com | admin123 | admin |
| instructor@lms.com | instructor123 | instructor |

---

## How to Use

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:3000/api
   ```

3. **Login:**
   - Find `POST /auth/login`
   - Click "Try it out"
   - Use credentials from table above
   - Click "Execute"

4. **Authorize:**
   - Copy the `access_token` from response
   - Click "Authorize" button (top right)
   - Enter: `Bearer <your_token>`
   - Click "Authorize" then "Close"

5. **Test Protected Endpoints:**
   - All endpoints under Users, Courses now work
   - Try `GET /users` to see paginated list
   - Try `GET /courses` to see courses

---

## Swagger UI Features

✨ **Auto-filled Examples** - All DTOs have example values  
🔍 **Search Filter** - Search endpoints by name  
⏱️ **Request Duration** - Shows how long each request takes  
🔐 **Persistent Auth** - JWT token stays after page refresh  
📱 **Responsive UI** - Works on mobile devices  
🎨 **Custom Styling** - Clean UI without Swagger branding  

---

## Testing with Swagger

### 1. Authentication Flow
```
1. POST /auth/login
   Body: { "email": "user@example.com", "password": "password123" }
   
2. Copy access_token from response

3. Click "Authorize" button
   Value: Bearer eyJhbGciOiJIUzI1NiIs...

4. Test protected routes
```

### 2. Pagination Example
```
GET /users?page=1&limit=5&role=student&search=john

Response:
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 5
}
```

### 3. Filter Courses
```
GET /courses?level=beginner&minPrice=0&maxPrice=100&status=published
```

---

## Files with Swagger Documentation

### Controllers:
- `src/auth/auth.controller.ts` - Authentication endpoints
- `src/users/users.controller.ts` - User management
- `src/courses/courses.controller.ts` - Course management
- `src/health/health.controller.ts` - Health checks

### DTOs:
- `src/auth/dto/login.dto.ts` - Login/request DTOs
- `src/users/dto/user.dto.ts` - User CRUD DTOs
- `src/courses/dto/course.dto.ts` - Course CRUD DTOs

### Main Configuration:
- `src/main.ts` - Swagger setup and configuration

---

## Next Steps

To add more features:

1. **Add Validation Pipes:**
   ```typescript
   @ApiResponse({ status: 400, description: 'Validation error' })
   ```

2. **Add File Upload:**
   ```typescript
   @ApiConsumes('multipart/form-data')
   @UseInterceptors(FileInterceptor('file'))
   ```

3. **Add API Versioning:**
   ```typescript
   @Controller({ version: '1', path: 'users' })
   ```

4. **Add Custom Decorators:**
   ```typescript
   @ApiCustomResponse(MyCustomDto)
   ```

---

## Links

- **Swagger UI:** http://localhost:3000/api
- **API JSON:** http://localhost:3000/api-json
- **Health Check:** http://localhost:3000/health

**All set! 🎉 Your API is now fully documented!**
