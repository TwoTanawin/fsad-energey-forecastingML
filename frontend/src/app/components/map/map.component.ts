import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { GeocodingService } from '../../services/geocoding.service';
import Swal from 'sweetalert2';

interface Device {
  id: number;
  position: google.maps.LatLngLiteral;
  address: string;
  avg_voltage: number;
  avg_power: number;
  avg_current: number;
  label: string;
  title: string;
  icon: google.maps.Icon; // Ensure icon.url is always a string
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Default center
  zoom = 12;
  devices: Device[] = []; // Holds all device data with positions
  showInfoWindow = false;
  infoWindowData: any = null;

  constructor(
    private deviceService: DeviceService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    Swal.fire({
      title: 'Loading devices...',
      text: 'Please wait while we load the device data and map.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    this.deviceService.getAllDevicesData().subscribe({
      next: (data) => {
        const devices = data.devices || [];
  
        // Fetch geocoding results with caching
        const geocodePromises = devices.map((device: any) =>
          this.geocodingService.getLatLng(device.register_device_details.address).toPromise()
        );
  
        Promise.all(geocodePromises)
          .then((positions) => {
            const devicesWithPositions: Device[] = devices.map((device: any, index: number) => ({
              id: device.id,
              position: positions[index],
              address: device.register_device_details.address,
              avg_voltage: device.avg_voltage,
              avg_power: device.avg_power,
              avg_current: device.avg_current,
              label: device.id.toString(),
              title: `Device ${device.id}`,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              },
            }));
  
            const colorMap = this.assignColorsForOverlappingPins(devicesWithPositions);
  
            this.devices = devicesWithPositions.map((device: Device) => ({
              ...device,
              icon: {
                url: colorMap.get(`${device.position.lat},${device.position.lng}`) || 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              },
            }));
  
            // Center the map at the first device's position
            if (this.devices.length > 0) {
              this.center = this.devices[0].position;
            }
  
            // Close the loading alert
            Swal.close();
          })
          .catch((error) => {
            console.error('Error geocoding device addresses:', error);
            Swal.fire('Error', 'Failed to load map data. Please try again later.', 'error');
          });
      },
      error: (err) => {
        console.error('Failed to fetch devices:', err);
        Swal.fire('Error', 'Failed to fetch devices. Please try again later.', 'error');
      },
    });
  }
  
  

  assignColorsForOverlappingPins(devices: Device[]): Map<string, string> {
    const positionMap = new Map<string, number>(); // To track number of devices per position
    const colorMap = new Map<string, string>(); // To store colors for positions

    const colors = [
      'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    ];

    devices.forEach((device) => {
      const positionKey = `${device.position.lat},${device.position.lng}`;
      const count = positionMap.get(positionKey) || 0;
      positionMap.set(positionKey, count + 1);

      // Assign a color based on the count, looping through available colors
      const color = colors[count % colors.length];
      colorMap.set(positionKey, color);
    });

    return colorMap;
  }

  onMarkerClick(device: Device): void {
    this.infoWindowData = {
      address: device.address,
      avg_voltage: device.avg_voltage,
      avg_power: device.avg_power,
      avg_current: device.avg_current,
    };
    this.showInfoWindow = true;
  }

  closeInfoWindow(): void {
    this.showInfoWindow = false;
    this.infoWindowData = null;
  }

  
}
