import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { CoursesModule } from './courses/courses.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, AdminModule, CoursesModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
