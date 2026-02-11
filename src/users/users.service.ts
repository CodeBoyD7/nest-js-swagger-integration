import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserRole, UserStatus } from './dto/user.dto';

@Injectable()
export class UsersService {
  private users: UserResponseDto[] = [
    {
      id: 1,
      email: 'admin@lms.com',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '+1234567890',
      bio: 'System Administrator',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 2,
      email: 'instructor@lms.com',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      role: UserRole.INSTRUCTOR,
      status: UserStatus.ACTIVE,
      phone: '+1234567891',
      bio: 'Senior Instructor with 10+ years experience',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: 3,
      email: 'student@lms.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      fullName: 'Bob Johnson',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
    },
  ];

  private nextId = 4;

  async findAll(query: any): Promise<{ data: UserResponseDto[]; total: number; page: number; limit: number }> {
    let filteredUsers = [...this.users];

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower),
      );
    }

    if (query.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === query.role);
    }

    if (query.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === query.status);
    }

    const total = filteredUsers.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredUsers.slice(start, end),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser: UserResponseDto = {
      id: this.nextId++,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      fullName: `${createUserDto.firstName} ${createUserDto.lastName}`,
      role: createUserDto.role,
      status: UserStatus.ACTIVE,
      phone: createUserDto.phone,
      bio: createUserDto.bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      fullName: updateUserDto.firstName || updateUserDto.lastName
        ? `${updateUserDto.firstName || this.users[userIndex].firstName} ${updateUserDto.lastName || this.users[userIndex].lastName}`
        : this.users[userIndex].fullName,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }
}
