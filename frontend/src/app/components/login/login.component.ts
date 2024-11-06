import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Handle form submission
  onSubmit() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please enter both email and password.',
      });
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (token) => {
        // Save the token (e.g., in localStorage or session storage)
        localStorage.setItem('authToken', token);

        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/map']);  // Navigate to dashboard or home page after login
        });
      },
      (error) => {
        // Show error alert if login fails
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password. Please try again.',
        });
        console.error('Login failed', error);
      }
    );
  }
}
