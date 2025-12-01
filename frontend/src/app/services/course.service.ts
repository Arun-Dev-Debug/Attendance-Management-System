import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    constructor(private http: HttpClient) { }

    createCourse(courseData: any): Observable<any> {
        return this.http.post(`${API_URL}/courses`, courseData);
    }

    getAllCourses(filters?: { teacherId?: string; isOnline?: boolean }): Observable<any> {
        let params = new HttpParams();

        if (filters?.teacherId) params = params.set('teacherId', filters.teacherId);
        if (filters?.isOnline !== undefined) params = params.set('isOnline', filters.isOnline.toString());

        return this.http.get(`${API_URL}/courses`, { params });
    }

    getCourse(courseId: string): Observable<any> {
        return this.http.get(`${API_URL}/courses/${courseId}`);
    }

    updateCourse(courseId: string, courseData: any): Observable<any> {
        return this.http.put(`${API_URL}/courses/${courseId}`, courseData);
    }

    deleteCourse(courseId: string): Observable<any> {
        return this.http.delete(`${API_URL}/courses/${courseId}`);
    }

    enrollStudent(courseId: string, studentId: string): Observable<any> {
        return this.http.post(`${API_URL}/courses/enroll`, { courseId, studentId });
    }

    unenrollStudent(courseId: string, studentId: string): Observable<any> {
        return this.http.delete(`${API_URL}/courses/${courseId}/students/${studentId}`);
    }

    getEnrolledStudents(courseId: string): Observable<any> {
        return this.http.get(`${API_URL}/courses/${courseId}/students`);
    }
}
