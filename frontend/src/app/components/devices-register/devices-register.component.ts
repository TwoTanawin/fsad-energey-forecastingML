import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-devices-register',
  templateUrl: './devices-register.component.html',
  styleUrls: ['./devices-register.component.scss']
})
export class DevicesRegisterComponent {
  deviceAddress: string = '';
  token: string | null = null;

  // Required fields
  province: string = '';
  district: string = '';
  subDistrict: string = '';
  postcode: string = '';
  country: string = '';

  // Optional fields
  streetName?: string;
  building?: string;
  houseNumber?: string;

  constructor(private deviceService: DeviceService) { }

  registerDevice() {
    // Validate required fields
    if (!this.province || !this.district || !this.subDistrict || !this.postcode || !this.country) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Province, District, Sub-district, Postcode, Country).',
      });
      return;
    }

    // Combine required and optional fields into a single address
    this.deviceAddress = [
      this.streetName,
      this.building,
      this.houseNumber,
      this.province,
      this.district,
      this.subDistrict,
      this.postcode,
      this.country,
    ]
      .filter(Boolean) // Remove undefined or empty fields
      .join(', ');

    console.log('Final device address:', this.deviceAddress);

    // Register the device
    this.deviceService.registerDevice(this.deviceAddress).subscribe({
      next: (response) => {
        console.log('Device registered successfully:', response);
        if (response.token) {
          this.token = response.token;

          // Success notification
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Device registered successfully!',
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Success',
            text: 'Device registered, but no token received.',
          });
        }
      },
      error: (error) => {
        console.error('Error registering device:', error);

        // Error notification
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to register device. Please try again later.',
        });
      },
    });
  }
}
