import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Store token in localStorage for persistent access
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, { user: userData });
  }

  // Login user and store token in localStorage
  login(email: string, password: string): Observable<string> {
    return this.http.post<any>(`${this.BASE_URL}/login`, { email, password }).pipe(
      map(response => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
        }
        return token;
      })
    );
  }

  // Function to get current user ID from the token
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload.user_id)
      return payload.user_id; // Assuming userId is stored in the payload
    }
    return null;
  }

  // Get specific user profile
  getUserProfile(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/users/${userId}`, { headers });
  }

  // Update user profile
  updateUserProfile(userId: number, userData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.BASE_URL}/users/${userId}`, { user: userData }, { headers });
  }
}
