import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsJWT } from 'class-validator';

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
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzY1NDMyMSwiZXhwIjoxNzA4MjU5MTIxfQ.sample_token',
    format: 'jwt',
  })
  @IsJWT()
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 604800,
  })
  expires_in: number;

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

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    example: 'student',
    enum: ['student', 'instructor', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2026-02-11T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=',
    required: true,
  })
  @IsString()
  refresh_token: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'UnauthorizedException',
  })
  error: string;
}
