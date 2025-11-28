import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  teacherId: string = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // In a real app, get teacherId from auth token
    this.teacherId = 'current-teacher-id';
    this.loadMyCourses();
  }

  loadMyCourses() {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading = false;
      }
    });
  }

  markAttendance(courseId: string) {
    this.router.navigate(['/teacher/mark-attendance', courseId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
