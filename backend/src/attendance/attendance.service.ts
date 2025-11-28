import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async markAttendance(markDto: MarkAttendanceDto, markedBy: string) {
        // Check if session exists
        const session = await this.prisma.session.findUnique({
            where: { id: markDto.sessionId },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        // Check if student is enrolled in the course
        const enrollment = await this.prisma.enrollment.findFirst({
            where: {
                courseId: session.courseId,
                userId: markDto.studentId,
                status: 'active',
            },
        });

        if (!enrollment) {
            throw new BadRequestException('Student not enrolled in this course');
        }

        // Create or update attendance record
        return this.prisma.attendance.upsert({
            where: {
                sessionId_studentId: {
                    sessionId: markDto.sessionId,
                    studentId: markDto.studentId,
                },
            },
            update: {
                status: markDto.status as AttendanceStatus,
                remarks: markDto.remarks,
                // markedBy, // markedBy is not in schema based on previous read, removing it
            },
            create: {
                sessionId: markDto.sessionId,
                studentId: markDto.studentId,
                status: markDto.status as AttendanceStatus,
                remarks: markDto.remarks,
                // markedBy, // markedBy is not in schema
            },
            include: {
                student: { // Changed from user to student based on schema relation
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        startTime: true, // Changed from sessionDate to startTime
                        course: {
                            select: {
                                name: true,
                                subject: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async bulkMarkAttendance(bulkDto: BulkAttendanceDto, markedBy: string) {
        const session = await this.prisma.session.findUnique({
            where: { id: bulkDto.sessionId },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        const results = await Promise.all(
            bulkDto.records.map((record) =>
                this.markAttendance(
                    {
                        sessionId: bulkDto.sessionId,
                        studentId: record.studentId,
                        status: record.status,
                    },
                    markedBy,
                ),
            ),
        );

        return {
            sessionId: bulkDto.sessionId,
            totalMarked: results.length,
            records: results,
        };
    }

    async getSessionAttendance(sessionId: string) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                course: {
                    include: {
                        enrollments: {
                            where: { status: 'active' },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
                attendance: {
                    include: {
                        student: { // Changed from user to student
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        return {
            session: {
                id: session.id,
                sessionDate: session.startTime,
                course: {
                    id: session.course.id,
                    name: session.course.name,
                    subject: session.course.subject,
                },
            },
            totalStudents: session.course.enrollments.length,
            markedCount: session.attendance.length,
            attendance: session.attendance,
            enrolledStudents: session.course.enrollments.map((e) => e.user),
        };
    }

    async getStudentAttendance(studentId: string, courseId?: string) {
        const where: any = {
            studentId: studentId, // Changed from userId to studentId
        };

        if (courseId) {
            where.session = {
                courseId,
            };
        }

        const attendance = await this.prisma.attendance.findMany({
            where,
            include: {
                session: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                name: true,
                                subject: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });

        const stats = await this.getStudentStats(studentId, courseId);

        return {
            attendance,
            stats,
        };
    }

    async getStudentStats(studentId: string, courseId?: string) {
        const where: any = {
            studentId: studentId, // Changed from userId to studentId
        };

        if (courseId) {
            where.session = {
                courseId,
            };
        }

        const [total, present, absent, late] = await Promise.all([
            this.prisma.attendance.count({ where }),
            this.prisma.attendance.count({ where: { ...where, status: AttendanceStatus.PRESENT } }),
            this.prisma.attendance.count({ where: { ...where, status: AttendanceStatus.ABSENT } }),
            this.prisma.attendance.count({ where: { ...where, status: AttendanceStatus.LATE } }),
        ]);

        const attendancePercentage = total > 0 ? ((present + late) / total) * 100 : 0;

        return {
            total,
            present,
            absent,
            late,
            attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        };
    }

    async updateAttendance(attendanceId: string, status: string, remarks?: string) {
        return this.prisma.attendance.update({
            where: { id: attendanceId },
            data: {
                status: status as AttendanceStatus,
                remarks,
            },
        });
    }

    async deleteAttendance(attendanceId: string) {
        return this.prisma.attendance.delete({
            where: { id: attendanceId },
        });
    }
}
