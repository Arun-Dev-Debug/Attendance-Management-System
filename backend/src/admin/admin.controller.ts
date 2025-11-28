import {
    Controller,
    Get,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    getAllUsers(
        @Query('role') role?: string,
        @Query('status') status?: string,
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllUsers({
            role,
            status,
            search,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('stats')
    getUserStats() {
        return this.adminService.getUserStats();
    }

    @Put('users/:id/approve')
    approveUser(@Param('id') id: string, @Request() req) {
        // TODO: Get admin ID from JWT token
        const adminId = req.user?.userId || 'admin';
        return this.adminService.approveUser(id, adminId);
    }

    @Put('users/:id/reject')
    rejectUser(@Param('id') id: string, @Request() req) {
        const adminId = req.user?.userId || 'admin';
        return this.adminService.rejectUser(id, adminId);
    }

    @Put('users/:id')
    updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
        return this.adminService.updateUser(id, updateData);
    }

    @Put('users/:id/deactivate')
    deactivateUser(@Param('id') id: string) {
        return this.adminService.deactivateUser(id);
    }
}
