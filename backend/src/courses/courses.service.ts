import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto) {
        if (!createCourseDto.teacherId) {
            throw new Error('Teacher ID is required');
        }

        return this.prisma.course.create({
            data: {
                name: createCourseDto.name,
                code: createCourseDto.code,
                subject: createCourseDto.subject,
                description: createCourseDto.description,
                teacherId: createCourseDto.teacherId,
                startDate: createCourseDto.startDate ? new Date(createCourseDto.startDate) : null,
                endDate: createCourseDto.endDate ? new Date(createCourseDto.endDate) : null,
                isOnline: createCourseDto.isOnline || false,
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(filters?: { teacherId?: string; isOnline?: boolean }) {
        const where: any = {};

        if (filters?.teacherId) {
            where.teacherId = filters.teacherId;
        }

        if (filters?.isOnline !== undefined) {
            where.isOnline = filters.isOnline;
        }

        return this.prisma.course.findMany({
            where,
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                        sessions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                enrollments: {
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
                sessions: {
                    orderBy: { startTime: 'desc' },
                    take: 10,
                },
            },
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        const updateData: any = { ...updateCourseDto };

        if (updateCourseDto.startDate) {
            updateData.startDate = new Date(updateCourseDto.startDate);
        }

        if (updateCourseDto.endDate) {
            updateData.endDate = new Date(updateCourseDto.endDate);
        }

        return this.prisma.course.update({
            where: { id },
            data: updateData,
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        return this.prisma.course.delete({
            where: { id },
        });
    }

    async enrollStudent(courseId: string, studentId: string, enrolledBy?: string) {
        return this.prisma.enrollment.create({
            data: {
                courseId,
                userId: studentId,
                enrolledBy,
                status: 'active',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        name: true,
                        subject: true,
                    },
                },
            },
        });
    }

    async unenrollStudent(courseId: string, studentId: string) {
        const enrollment = await this.prisma.enrollment.findFirst({
            where: {
                courseId,
                userId: studentId,
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        return this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'dropped' },
        });
    }

    async getEnrolledStudents(courseId: string) {
        return this.prisma.enrollment.findMany({
            where: {
                courseId,
                status: 'active',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
}
