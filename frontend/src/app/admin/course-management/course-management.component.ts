import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses: any[] = [];
  teachers: any[] = [];
  students: any[] = [];
  loading = true;
  showCreateForm = false;
  showEnrollForm = false;
  selectedCourse: any = null;

  courseForm = {
    name: '',
    code: '',
    subject: '',
    description: '',
    teacherId: '',
    startDate: '',
    endDate: '',
    isOnline: false
  };

  enrollForm = {
    courseId: '',
    studentId: ''
  };

  constructor(
    private courseService: CourseService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.loadCourses();
    this.loadTeachers();
    this.loadStudents();
  }

  loadCourses() {
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

  loadTeachers() {
    this.adminService.getAllUsers({ role: 'TEACHER', status: 'approved' }).subscribe({
      next: (response) => {
        this.teachers = response.data;
      },
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

  loadStudents() {
    this.adminService.getAllUsers({ role: 'STUDENT', status: 'approved' }).subscribe({
      next: (response) => {
        this.students = response.data;
      },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.courseForm = {
      name: '',
      code: '',
      subject: '',
      description: '',
      teacherId: '',
      startDate: '',
      endDate: '',
      isOnline: false
    };
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  createCourse() {
    if (!this.courseForm.name || !this.courseForm.code || !this.courseForm.subject) {
      alert('Please fill in required fields (Name, Code, Subject)');
      return;
    }

    this.courseService.createCourse(this.courseForm).subscribe({
      next: () => {
        alert('Course created successfully');
        this.closeCreateForm();
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error creating course:', err);
        alert('Failed to create course');
      }
    });
  }

  deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          alert('Course deleted successfully');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Failed to delete course');
        }
      });
    }
  }

  openEnrollForm(course: any) {
    this.selectedCourse = course;
    this.enrollForm.courseId = course.id;
    this.showEnrollForm = true;
  }

  closeEnrollForm() {
    this.showEnrollForm = false;
    this.selectedCourse = null;
  }

  enrollStudent() {
    if (!this.enrollForm.studentId) {
      alert('Please select a student');
      return;
    }

    this.courseService.enrollStudent(this.enrollForm.courseId, this.enrollForm.studentId).subscribe({
      next: () => {
        alert('Student enrolled successfully');
        this.closeEnrollForm();
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error enrolling student:', err);
        alert('Failed to enroll student');
      }
    });
  }

  viewCourseDetails(course: any) {
    this.selectedCourse = course;
    // Could navigate to a detailed view or show modal
    console.log('Course details:', course);
  }
}
