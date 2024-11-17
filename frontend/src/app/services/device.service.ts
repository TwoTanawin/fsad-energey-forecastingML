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
    console.log("token :",token)
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

  // getDeviceById(deviceId: string | number): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/devices/${deviceId}`);
  // }

  // getDeviceById(deviceId: string): Observable<any> {
  //   const token = 'ecb5521a3bb0d9ac0631c9d13cb00441'; // Token hardcoded for now
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get(`${this.BASE_URL}/devices/${deviceId}/data`, { headers });
  // }

    // Existing method to fetch device details
    getDeviceById(deviceId: string, token: string): Observable<any> {
      // const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get(`${this.BASE_URL}/devices/${deviceId}/data`, { headers });
    }
  
    // New method to fetch token by device ID
    getTokenByDeviceId(deviceId: string): Observable<any> {
      const token = localStorage.getItem('authToken'); // Retrieve token dynamically
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get(`${this.BASE_URL}/register_devices/${deviceId}/token`, { headers });
    }
  

  getDeviceData(deviceId: string,): Observable<any> {
    return this.http.get(`${this.BASE_URL}/devices/${deviceId}/data`, { headers: this.getAuthHeaders()});
  }

  getDeviceId(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/register_devices/device_info`, { headers: this.getAuthHeaders() });
  }
}
