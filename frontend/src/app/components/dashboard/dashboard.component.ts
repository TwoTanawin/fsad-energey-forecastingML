import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  devices: any[] = [];

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserDevices();
  }

  checkUserDevices(): void {
    this.deviceService.getUserDevices().subscribe({
      next: (response) => {
        this.devices = response.devices || [];
        if (this.devices.length === 0) {
          this.router.navigate(['/devices-register']);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.router.navigate(['/devices-register']);
        } else {
          console.error('Error checking user devices:', error);
          alert('Error checking devices. Please try again later.');
        }
      }
    });
  }

  viewDeviceDetail(deviceId: string): void {
    this.router.navigate([`/dashboard/${deviceId}`]);
  }
  
}
