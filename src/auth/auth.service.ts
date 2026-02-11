import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginResponseDto, ProfileResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Demo user authentication - replace with real DB lookup
    const demoUsers = [
      {
        email: 'user@example.com',
        password: 'password123',
        id: 1,
        name: 'John Doe',
        role: 'student',
      },
      {
        email: 'admin@lms.com',
        password: 'admin123',
        id: 2,
        name: 'Admin User',
        role: 'admin',
      },
      {
        email: 'instructor@lms.com',
        password: 'instructor123',
        id: 3,
        name: 'Jane Smith',
        role: 'instructor',
      },
    ];

    const user = demoUsers.find(
      (u) => u.email === loginDto.email && u.password === loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: 604800, // 7 days in seconds
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(): Promise<ProfileResponseDto> {
    // In a real app, you would get the user from the JWT token
    return {
      id: 1,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'student',
      createdAt: new Date().toISOString(),
    };
  }
}
