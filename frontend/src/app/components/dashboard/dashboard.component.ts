import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserDevices();
  }

  checkUserDevices(): void {
    this.deviceService.getUserDevices().subscribe({
      next: (response) => {
        const devices = response.devices || [];
        if (devices.length === 0) {
          // No devices registered, redirect to the device registration page
          this.router.navigate(['/devices-register']);
        } else {
          alert(`You have ${devices.length} registered device(s).`);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          console.warn('No devices found for this user.');
          // Redirect to the device registration page
          this.router.navigate(['/devices-register']);
        } else {
          console.error('Error checking user devices:', error);
          alert('Error checking devices. Please try again later.');
        }
      }
    });
  }
  
}
