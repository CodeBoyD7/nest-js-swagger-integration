import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseResponseDto,
  CourseListResponseDto,
  QueryCourseDto,
  CourseLevel,
  CourseStatus,
} from './dto/course.dto';

@ApiTags('Courses')
@ApiBearerAuth('jwt-auth')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all courses',
    description: 'Retrieve a paginated list of courses with optional filtering',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or description' })
  @ApiQuery({ name: 'level', required: false, enum: CourseLevel, description: 'Filter by course level' })
  @ApiQuery({ name: 'status', required: false, enum: CourseStatus, description: 'Filter by course status' })
  @ApiQuery({ name: 'instructorId', required: false, description: 'Filter by instructor ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'List of courses retrieved successfully',
    type: CourseListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: QueryCourseDto): Promise<CourseListResponseDto> {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get course by ID',
    description: 'Retrieve a specific course by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course found successfully',
    type: CourseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CourseResponseDto> {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new course',
    description: 'Create a new course with the specified details',
  })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    type: CourseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update course',
    description: 'Update an existing course information',
  })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: CourseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete course',
    description: 'Permanently delete a course',
  })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Course deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.coursesService.remove(id);
  }
}
