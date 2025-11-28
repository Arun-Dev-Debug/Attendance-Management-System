import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'STUDENT';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };
    this.authService.register(userData).subscribe({
      next: (res) => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed');
      }
    });
  }
}
