import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    constructor(private http: HttpClient) { }

    markAttendance(data: {
        sessionId: string;
        studentId: string;
        status: string;
        remarks?: string;
    }): Observable<any> {
        return this.http.post(`${API_URL}/attendance/mark`, data);
    }

    bulkMarkAttendance(data: {
        sessionId: string;
        records: Array<{ studentId: string; status: string }>;
    }): Observable<any> {
        return this.http.post(`${API_URL}/attendance/bulk`, data);
    }

    getSessionAttendance(sessionId: string): Observable<any> {
        return this.http.get(`${API_URL}/attendance/session/${sessionId}`);
    }

    getStudentAttendance(studentId: string, courseId?: string): Observable<any> {
        const url = courseId
            ? `${API_URL}/attendance/student/${studentId}?courseId=${courseId}`
            : `${API_URL}/attendance/student/${studentId}`;
        return this.http.get(url);
    }

    updateAttendance(attendanceId: string, status: string, remarks?: string): Observable<any> {
        return this.http.put(`${API_URL}/attendance/${attendanceId}`, { status, remarks });
    }

    deleteAttendance(attendanceId: string): Observable<any> {
        return this.http.delete(`${API_URL}/attendance/${attendanceId}`);
    }
}
