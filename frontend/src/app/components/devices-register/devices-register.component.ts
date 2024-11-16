import { Component } from '@angular/core';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-devices-register',
  templateUrl: './devices-register.component.html',
  styleUrls: ['./devices-register.component.scss']
})
export class DevicesRegisterComponent {
  deviceAddress: string = '';
  token: string | null = null;

  constructor(private deviceService: DeviceService) {}

  registerDevice() {
    if (this.deviceAddress) {
      // Call the service to register the device
      this.deviceService.registerDevice(this.deviceAddress).subscribe({
        next: (response) => {
          console.log('Device registered successfully:', response);
          if (response.token) {
            this.token = response.token; // Display the new token
          } else {
            alert('Device registered, but no token received.');
          }
        },
        error: (error) => {
          console.error('Error registering device:', error);
          alert('Failed to register device.');
        }
      });
    } else {
      alert('Please provide a device address.');
    }
  }
}
