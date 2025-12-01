import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private http: HttpClient) { }

    getAllUsers(filters?: {
        role?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Observable<any> {
        let params = new HttpParams();

        if (filters?.role) params = params.set('role', filters.role);
        if (filters?.status) params = params.set('status', filters.status);
        if (filters?.search) params = params.set('search', filters.search);
        if (filters?.page) params = params.set('page', filters.page.toString());
        if (filters?.limit) params = params.set('limit', filters.limit.toString());

        return this.http.get(`${API_URL}/admin/users`, { params });
    }

    getUserStats(): Observable<any> {
        return this.http.get(`${API_URL}/admin/stats`);
    }

    approveUser(userId: string): Observable<any> {
        return this.http.put(`${API_URL}/admin/users/${userId}/approve`, {});
    }

    rejectUser(userId: string): Observable<any> {
        return this.http.put(`${API_URL}/admin/users/${userId}/reject`, {});
    }

    updateUser(userId: string, data: any): Observable<any> {
        return this.http.put(`${API_URL}/admin/users/${userId}`, data);
    }

    deactivateUser(userId: string): Observable<any> {
        return this.http.put(`${API_URL}/admin/users/${userId}/deactivate`, {});
    }
}
