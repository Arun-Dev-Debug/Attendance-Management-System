import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    findAll(
        @Query('teacherId') teacherId?: string,
        @Query('isOnline') isOnline?: string,
    ) {
        return this.coursesService.findAll({
            teacherId,
            isOnline: isOnline === 'true' ? true : isOnline === 'false' ? false : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }

    @Post('enroll')
    enrollStudent(@Body() enrollDto: EnrollStudentDto) {
        return this.coursesService.enrollStudent(
            enrollDto.courseId,
            enrollDto.studentId,
        );
    }

    @Delete(':courseId/students/:studentId')
    unenrollStudent(
        @Param('courseId') courseId: string,
        @Param('studentId') studentId: string,
    ) {
        return this.coursesService.unenrollStudent(courseId, studentId);
    }

    @Get(':id/students')
    getEnrolledStudents(@Param('id') id: string) {
        return this.coursesService.getEnrolledStudents(id);
    }
}
