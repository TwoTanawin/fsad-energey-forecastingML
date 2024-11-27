import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  icon: google.maps.Symbol;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 13.7563, lng: 100.5018 }; // Bangkok center
  zoom = 10;
  devices: Device[] = [];
  showInfoWindow = false;
  infoWindowData: any = null;
  summarizedData: any = {
    totalPower: 0,
    avgVoltage: 0,
    avgCurrent: 0,
    totalReadings: 0,
    text: '',
  };

  private GROQ_API_KEY = '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';
  private GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    Swal.fire({
      title: 'Loading Devices',
      html: 'Fetching real-time energy consumption data...',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    this.deviceService.getAllDevicesData().subscribe({
      next: async (data) => {
        const devices = data.devices || [];

        const cachedPositions = new Map<string, google.maps.LatLngLiteral>();
        devices.forEach((device: any) => {
          const address = device.register_device_details.address;
          const cached = localStorage.getItem(address);
          if (cached) {
            cachedPositions.set(address, JSON.parse(cached));
          }
        });

        const uncachedDevices = devices.filter(
          (device: any) => !cachedPositions.has(device.register_device_details.address)
        );

        const geocodePromises = uncachedDevices.map((device: any) =>
          this.geocodingService.getLatLng(device.register_device_details.address).toPromise()
        );

        try {
          const newPositions = await Promise.all(geocodePromises);

          uncachedDevices.forEach((device: any, index: number) => {
            const address = device.register_device_details.address;
            const position = newPositions[index];
            localStorage.setItem(address, JSON.stringify(position));
            cachedPositions.set(address, position);
          });

          this.devices = devices.map((device: any) => ({
            id: device.id,
            position: cachedPositions.get(device.register_device_details.address)!,
            address: device.register_device_details.address,
            avg_voltage: device.avg_voltage,
            avg_power: device.avg_power,
            avg_current: device.avg_current,
            label: device.id.toString(),
            title: `Device ${device.id}`,
            icon: this.createDeviceMarkerSymbol(device.avg_power),
          }));

          Swal.close();

          // Compute metrics locally
          this.computeEnergyMetrics();

          // Summarize energy data using GROQ API
          await this.summarizeEnergyData();
        } catch (error) {
          console.error('Geocoding error:', error);
          Swal.fire('Error', 'Failed to load map data', 'error');
        }
      },
      error: (err) => {
        console.error('Devices fetch error:', err);
        Swal.fire('Error', 'Failed to fetch devices', 'error');
      },
    });
  }

  computeEnergyMetrics(): void {
    const totalPower = this.devices.reduce((sum, device) => sum + device.avg_power, 0);
    const totalVoltage = this.devices.reduce((sum, device) => sum + device.avg_voltage, 0);
    const totalCurrent = this.devices.reduce((sum, device) => sum + device.avg_current, 0);
    const totalReadings = this.devices.length;

    this.summarizedData.totalPower = totalPower.toFixed(2);
    this.summarizedData.avgVoltage = (totalVoltage / totalReadings || 0).toFixed(2);
    this.summarizedData.avgCurrent = (totalCurrent / totalReadings || 0).toFixed(2);
    this.summarizedData.totalReadings = totalReadings;
  }

  async summarizeEnergyData(): Promise<void> {
    const energyData = this.devices.map((device) => ({
      voltage: device.avg_voltage,
      power: device.avg_power,
      current: device.avg_current,
    }));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are an energy summarization assistant." },
        { role: "user", content: `Summarize the energy consumption data: ${JSON.stringify(energyData)} (in short content [3 lines])` },
      ],
    };

    try {
      const response: any = await this.http.post(this.GROQ_API_URL, body, { headers }).toPromise();

      console.log('GROQ API Response:', response);

      if (response.choices && response.choices[0]) {
        this.summarizedData.text = response.choices[0].message.content;
      } else {
        Swal.fire('Error', 'Unexpected response format from GROQ API', 'error');
      }
    } catch (error) {
      console.error('Error Response:', error);
      Swal.fire('Error', 'Failed to summarize energy data', 'error');
    }
  }

  createDeviceMarkerSymbol(power: number): google.maps.Symbol {
    const getPowerColor = (powerValue: number) => {
      if (powerValue < 50) return '#4CAF50'; // Green for low power
      if (powerValue < 100) return '#FFC107'; // Yellow for medium power
      return '#F44336'; // Red for high power
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: getPowerColor(power),
      fillOpacity: 0.8,
      strokeColor: '#000',
      strokeWeight: 2,
    };
  }

  onMarkerClick(device: Device): void {
    this.infoWindowData = {
      address: device.address,
      avg_voltage: device.avg_voltage.toFixed(2),
      avg_power: device.avg_power.toFixed(2),
      avg_current: device.avg_current.toFixed(2),
    };
    this.showInfoWindow = true;
  }

  closeInfoWindow(): void {
    this.showInfoWindow = false;
    this.infoWindowData = null;
  }
}
