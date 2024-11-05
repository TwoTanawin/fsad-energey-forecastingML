import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Handle form submission
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // Register user using AuthService
    this.authService.register(userData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);  // Navigate to login page after successful registration
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'There was an issue with your registration. Please try again.',
        });
        console.error('Registration failed', error);
      }
    );
  }
}
