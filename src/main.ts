import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || 'LMS API')
      .setDescription(process.env.SWAGGER_DESCRIPTION || 'Learning Management System REST API')
      .setVersion(process.env.SWAGGER_VERSION || '1.0')
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
    SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'LMS API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
    });

    console.log(`📚 Swagger UI available at: http://localhost:${process.env.PORT || 3000}/${process.env.SWAGGER_PATH || 'api'}`);
    console.log(`📖 API JSON available at: http://localhost:${process.env.PORT || 3000}/${process.env.SWAGGER_PATH || 'api'}-json`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
