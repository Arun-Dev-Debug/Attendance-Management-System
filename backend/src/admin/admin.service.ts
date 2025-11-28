import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // ... (rest of the file)



    async getAllUsers(filters?: {
        role?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.role) {
            where.role = filters.role;
        }

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    approvedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async approveUser(userId: string, adminId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'approved',
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
    }

    async rejectUser(userId: string, adminId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'rejected',
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
    }

    async updateUser(userId: string, updateData: UpdateUserDto) {
        const data: any = { ...updateData };
        if (updateData.role) {
            data.role = updateData.role as Role;
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: data,
        });
    }

    async deactivateUser(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'inactive' },
        });
    }

    async getUserStats() {
        const [total, pending, approved, byRole] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: 'pending' } }),
            this.prisma.user.count({ where: { status: 'approved' } }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: true,
            }),
        ]);

        return {
            total,
            pending,
            approved,
            byRole: byRole.reduce((acc, curr) => {
                acc[curr.role] = curr._count;
                return acc;
            }, {}),
        };
    }
}
