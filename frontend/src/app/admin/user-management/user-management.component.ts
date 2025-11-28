import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  loading = true;
  filters = {
    role: '',
    status: '',
    search: '',
    page: 1,
    limit: 10
  };
  meta: any = null;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers(this.filters).subscribe({
      next: (response) => {
        this.users = response.data;
        this.meta = response.meta;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadUsers();
  }

  clearFilters() {
    this.filters = {
      role: '',
      status: '',
      search: '',
      page: 1,
      limit: 10
    };
    this.loadUsers();
  }

  approveUser(userId: string) {
    if (confirm('Are you sure you want to approve this user?')) {
      this.adminService.approveUser(userId).subscribe({
        next: () => {
          alert('User approved successfully');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error approving user:', err);
          alert('Failed to approve user');
        }
      });
    }
  }

  rejectUser(userId: string) {
    if (confirm('Are you sure you want to reject this user?')) {
      this.adminService.rejectUser(userId).subscribe({
        next: () => {
          alert('User rejected successfully');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error rejecting user:', err);
          alert('Failed to reject user');
        }
      });
    }
  }

  deactivateUser(userId: string) {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.adminService.deactivateUser(userId).subscribe({
        next: () => {
          alert('User deactivated successfully');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deactivating user:', err);
          alert('Failed to deactivate user');
        }
      });
    }
  }

  nextPage() {
    if (this.filters.page < this.meta.totalPages) {
      this.filters.page++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.loadUsers();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'TEACHER': return 'role-teacher';
      case 'STUDENT': return 'role-student';
      default: return '';
    }
  }
}
