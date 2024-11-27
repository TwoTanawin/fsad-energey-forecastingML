import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import Swal from 'sweetalert2';

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

  confirmDeleteDevice(deviceId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteDevice(deviceId);
      }
    });
  }
  
  deleteDevice(deviceId: string): void {
    this.deviceService.deleteDevice(deviceId).subscribe({
      next: (response) => {
        console.log('Device deleted successfully:', response);
  
        // Update the devices array by removing the deleted device
        this.devices = this.devices.filter((device) => device.id !== deviceId);
  
        // Show success notification using SweetAlert
        Swal.fire({
          title: 'Deleted!',
          text: 'The device has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Error deleting device:', error);
  
        // Show error notification using SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the device. Please try again later.',
          icon: 'error',
        });
      },
    });
  }
  
  
}
