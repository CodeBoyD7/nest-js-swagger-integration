import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto, CourseResponseDto, CourseStatus, CourseLevel } from './dto/course.dto';

@Injectable()
export class CoursesService {
  private courses: CourseResponseDto[] = [
    {
      id: 1,
      title: 'Complete NestJS Bootcamp',
      description: 'Learn NestJS from scratch to advanced level with real-world projects',
      level: CourseLevel.BEGINNER,
      duration: 20,
      price: 99.99,
      status: CourseStatus.PUBLISHED,
      instructor: {
        id: 2,
        name: 'Jane Smith',
        email: 'instructor@lms.com',
      },
      tags: ['nestjs', 'backend', 'typescript'],
      rating: 4.5,
      enrolledStudents: 150,
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-10'),
    },
    {
      id: 2,
      title: 'Advanced TypeScript Patterns',
      description: 'Master advanced TypeScript concepts and design patterns',
      level: CourseLevel.ADVANCED,
      duration: 15,
      price: 149.99,
      status: CourseStatus.PUBLISHED,
      instructor: {
        id: 2,
        name: 'Jane Smith',
        email: 'instructor@lms.com',
      },
      tags: ['typescript', 'advanced', 'patterns'],
      rating: 4.8,
      enrolledStudents: 89,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-02-05'),
    },
    {
      id: 3,
      title: 'React Fundamentals',
      description: 'Build modern web applications with React',
      level: CourseLevel.BEGINNER,
      duration: 12,
      price: 79.99,
      status: CourseStatus.PUBLISHED,
      instructor: {
        id: 2,
        name: 'Jane Smith',
        email: 'instructor@lms.com',
      },
      tags: ['react', 'frontend', 'javascript'],
      rating: 4.3,
      enrolledStudents: 230,
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-02-08'),
    },
  ];

  private nextId = 4;

  async findAll(query: any): Promise<{ data: CourseResponseDto[]; total: number; page: number; limit: number }> {
    let filteredCourses = [...this.courses];

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower),
      );
    }

    if (query.level) {
      filteredCourses = filteredCourses.filter((course) => course.level === query.level);
    }

    if (query.status) {
      filteredCourses = filteredCourses.filter((course) => course.status === query.status);
    }

    if (query.instructorId) {
      filteredCourses = filteredCourses.filter((course) => course.instructor.id === query.instructorId);
    }

    if (query.minPrice !== undefined) {
      filteredCourses = filteredCourses.filter((course) => course.price >= query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      filteredCourses = filteredCourses.filter((course) => course.price <= query.maxPrice);
    }

    const total = filteredCourses.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredCourses.slice(start, end),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<CourseResponseDto> {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    const newCourse: CourseResponseDto = {
      id: this.nextId++,
      title: createCourseDto.title,
      description: createCourseDto.description,
      level: createCourseDto.level,
      duration: createCourseDto.duration,
      price: createCourseDto.price,
      status: CourseStatus.DRAFT,
      instructor: {
        id: createCourseDto.instructorId || 2,
        name: 'Jane Smith',
        email: 'instructor@lms.com',
      },
      tags: createCourseDto.tags || [],
      rating: 0,
      enrolledStudents: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<CourseResponseDto> {
    const courseIndex = this.courses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const updatedCourse = {
      ...this.courses[courseIndex],
      ...updateCourseDto,
      updatedAt: new Date(),
    };

    this.courses[courseIndex] = updatedCourse;
    return updatedCourse;
  }

  async remove(id: number): Promise<void> {
    const courseIndex = this.courses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    this.courses.splice(courseIndex, 1);
  }
}
