import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private BASE_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  registerDevice(deviceAddress: string): Observable<any> {
    const deviceData = { address: deviceAddress };
    return this.http.post(`${this.BASE_URL}/register_devices`, deviceData, { headers: this.getAuthHeaders() });
  }

  getUserDevices(): Observable<any>{
    return this.http.get(`${this.BASE_URL}/register_devices/list_user_devices`, { headers: this.getAuthHeaders() });
  }


}
