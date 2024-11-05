import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000';  // Replace with your actual base URL

  constructor(private http: HttpClient) {}

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, { user: userData });
  }

  // Login user
  login(email: string, password: string): Observable<string> {
    return this.http.post<any>(`${this.BASE_URL}/login`, { email, password }).pipe(
      map(response => response.token)  // Extract token from response
    );
  }

  // Access protected endpoint
  getUsers(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.BASE_URL}/users`, { headers });
  }
}
