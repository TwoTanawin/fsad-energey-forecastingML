import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Assuming AuthService has isLoggedIn method

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLogined()) { // Call the method correctly with parentheses
      return true; // Allow route access
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      return false; // Deny route access
    }
  }
}
