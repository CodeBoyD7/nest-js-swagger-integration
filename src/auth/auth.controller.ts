import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, ProfileResponseDto, ErrorResponseDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password to receive a JWT access token',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Login successful - Returns JWT token and user information',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials - Email or password is incorrect',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error (missing fields or invalid format)',
    type: ErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get the profile information of the currently authenticated user. Requires a valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Token valid but user access denied',
    type: ErrorResponseDto,
  })
  async getProfile(): Promise<ProfileResponseDto> {
    return this.authService.getProfile();
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout the current user and invalidate the JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
