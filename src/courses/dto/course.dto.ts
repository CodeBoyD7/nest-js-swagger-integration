import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, IsDecimal, Min, Max, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Complete NestJS Bootcamp',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn NestJS from scratch to advanced level with real-world projects',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Course level',
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    required: true,
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    description: 'Course duration in hours',
    example: 20,
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Course price in USD',
    example: 99.99,
    required: true,
  })
  @IsDecimal()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Instructor ID',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  instructorId?: number;

  @ApiPropertyOptional({
    description: 'Course tags',
    example: ['nestjs', 'backend', 'typescript'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'Course title',
    example: 'Complete NestJS Bootcamp',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Course description',
    example: 'Learn NestJS from scratch to advanced level with real-world projects',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Course level',
    enum: CourseLevel,
    example: CourseLevel.INTERMEDIATE,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'Course duration in hours',
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Course price in USD',
    example: 129.99,
  })
  @IsOptional()
  @IsDecimal()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Course status',
    enum: CourseStatus,
    example: CourseStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'Course tags',
    example: ['nestjs', 'backend', 'typescript', 'api'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CourseResponseDto {
  @ApiProperty({
    description: 'Course ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Course title',
    example: 'Complete NestJS Bootcamp',
  })
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn NestJS from scratch to advanced level with real-world projects',
  })
  description: string;

  @ApiProperty({
    description: 'Course level',
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @ApiProperty({
    description: 'Course duration in hours',
    example: 20,
  })
  duration: number;

  @ApiProperty({
    description: 'Course price in USD',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Course status',
    enum: CourseStatus,
    example: CourseStatus.PUBLISHED,
  })
  status: CourseStatus;

  @ApiProperty({
    description: 'Instructor information',
    example: {
      id: 2,
      name: 'Jane Smith',
      email: 'instructor@lms.com',
    },
  })
  instructor: {
    id: number;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Course tags',
    example: ['nestjs', 'backend', 'typescript'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Average rating',
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: 'Total enrolled students',
    example: 150,
  })
  enrolledStudents: number;

  @ApiProperty({
    description: 'Course creation date',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Course last update date',
    example: '2026-02-10T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class CourseListResponseDto {
  @ApiProperty({
    description: 'List of courses',
    type: [CourseResponseDto],
  })
  data: CourseResponseDto[];

  @ApiProperty({
    description: 'Total number of courses',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;
}

export class QueryCourseDto {
  @ApiPropertyOptional({
    description: 'Search by title or description',
    example: 'nestjs',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by level',
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: CourseStatus,
    example: CourseStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    description: 'Filter by instructor ID',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  instructorId?: number;

  @ApiPropertyOptional({
    description: 'Minimum price',
    example: 0,
  })
  @IsOptional()
  @IsDecimal()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    example: 200,
  })
  @IsOptional()
  @IsDecimal()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
