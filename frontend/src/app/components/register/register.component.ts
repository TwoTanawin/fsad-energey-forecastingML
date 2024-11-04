import { Component } from '@angular/core';
// import { AuthService } from '../../services/authentication.service';
import { Router } from '@angular/router';  // Import Router for navigation

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
    // private authService: AuthService, 
    private router: Router
  ) {}  // Inject the Router

  // Handle form submission
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // // Send the user data to the backend for registration
    // this.authService.register(userData).subscribe({
    //   next: (response) => {
    //     console.log('User registered:', response);
    //     alert('Registration successful!');

    //     // Navigate to the login page after successful registration
    //     this.router.navigate(['/signin']);
    //   },
    //   error: (error) => {
    //     console.error('Error registering user:', error);
    //     alert('Registration failed!');
    //   }
    // });
  }
}
