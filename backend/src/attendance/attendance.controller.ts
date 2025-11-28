import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('mark')
    markAttendance(@Body() markDto: MarkAttendanceDto, @Request() req) {
        const markedBy = req.user?.userId || 'teacher';
        return this.attendanceService.markAttendance(markDto, markedBy);
    }

    @Post('bulk')
    bulkMarkAttendance(@Body() bulkDto: BulkAttendanceDto, @Request() req) {
        const markedBy = req.user?.userId || 'teacher';
        return this.attendanceService.bulkMarkAttendance(bulkDto, markedBy);
    }

    @Get('session/:id')
    getSessionAttendance(@Param('id') id: string) {
        return this.attendanceService.getSessionAttendance(id);
    }

    @Get('student/:id')
    getStudentAttendance(
        @Param('id') id: string,
        @Query('courseId') courseId?: string,
    ) {
        return this.attendanceService.getStudentAttendance(id, courseId);
    }

    @Put(':id')
    updateAttendance(
        @Param('id') id: string,
        @Body('status') status: string,
        @Body('remarks') remarks?: string,
    ) {
        return this.attendanceService.updateAttendance(id, status, remarks);
    }

    @Delete(':id')
    deleteAttendance(@Param('id') id: string) {
        return this.attendanceService.deleteAttendance(id);
    }
}
