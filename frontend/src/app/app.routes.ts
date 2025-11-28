import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { CourseManagementComponent } from './admin/course-management/course-management.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { MarkAttendanceComponent } from './teacher/mark-attendance/mark-attendance.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin/dashboard', component: AdminDashboardComponent },
    { path: 'admin/users', component: UserManagementComponent },
    { path: 'admin/courses', component: CourseManagementComponent },
    { path: 'teacher/dashboard', component: TeacherDashboardComponent },
    { path: 'teacher/mark-attendance/:courseId', component: MarkAttendanceComponent },
];
