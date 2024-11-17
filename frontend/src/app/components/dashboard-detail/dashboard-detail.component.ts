import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  device: any = null; // Holds detailed information about a specific device
  deviceToken: string | null = null; // Holds the device token

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) {}

  ngOnInit(): void {
    const deviceId = this.route.snapshot.paramMap.get('device_id');
    console.log('Extracted Device ID:', deviceId); // Logs the extracted device ID

    if (deviceId) {
      this.logDeviceTokenAndFetchDetails(deviceId); // Fetch both token and details
    } else {
      console.error('Device ID is missing in the route.');
    }
  }

  logDeviceTokenAndFetchDetails(deviceId: string): void {
    this.deviceService.getTokenByDeviceId(deviceId).subscribe({
      next: (response) => {
        if (response.token) {
          this.deviceToken = response.token;
          console.log(`Token for device ID ${deviceId}:`, this.deviceToken);
  
          // Ensure deviceToken is not null before calling fetchDeviceDetails
          if (this.deviceToken) {
            this.fetchDeviceDetails(deviceId, this.deviceToken);
          } else {
            console.error('Device token is null. Unable to fetch device details.');
          }
        } else {
          console.warn(`No token found for device ID ${deviceId}`);
        }
      },
      error: (error) => {
        console.error(`Error fetching token for device ID ${deviceId}:`, error);
      },
    });
  }
  

  /**
   * Fetches device details using the device ID and token.
   */
  fetchDeviceDetails(deviceId: string, token: string): void {
    this.deviceService.getDeviceById(deviceId, token).subscribe({
      next: (response) => {
        console.log('Device Data:', response);
        if (response.data && response.data.length > 0) {
          this.device = response.data[0]; // Bind the first record of data
        } else {
          console.warn('No data available for this device.');
          this.device = null;
        }
      },
      error: (error) => {
        console.error('Error fetching device data:', error);
        this.device = null;
      },
    });
  }
}
