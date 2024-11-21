import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  deviceData: any[] = []; // Metrics from the device
  chart: any; // Reference to the Chart.js instance

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) { }

  ngOnInit(): void {
    Chart.register(...registerables); // Register all required Chart.js components
    const deviceId = this.route.snapshot.paramMap.get('device_id');
    if (deviceId) {
      this.logDeviceTokenAndFetchDetails(deviceId);
    } else {
      console.error('Device ID is missing in the route.');
    }
  }

  logDeviceTokenAndFetchDetails(deviceId: string): void {
    this.deviceService.getTokenByDeviceId(deviceId).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.fetchDeviceDetails(deviceId, response.token);
        } else {
          console.warn('No token received for the device.');
        }
      },
      error: (err) => {
        console.error('Error fetching device token:', err);
      },
    });
  }

  fetchDeviceDetails(deviceId: string, token: string): void {
    this.deviceService.getDeviceData(deviceId, token).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.deviceData = response.data;
          setTimeout(() => this.initializeChart(), 0);
        } else {
          this.deviceData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching device data:', err);
      },
    });
  }

  initializeChart(): void {
    // Destroy existing charts if they exist
    if (this.chart) {
      this.chart.destroy();
    }
  
    const voltageCtx = document.getElementById('voltageChart') as HTMLCanvasElement;
    const powerCtx = document.getElementById('powerChart') as HTMLCanvasElement;
    const currentCtx = document.getElementById('currentChart') as HTMLCanvasElement;
  
    if (!voltageCtx || !powerCtx || !currentCtx) {
      console.error('One or more chart canvas elements are not found.');
      return;
    }
  
    const maxPoints = 10; // Maximum number of points to display
    let indices = this.deviceData.map((_, index) => index + 1); // Generate 1-based indices
    let voltages = this.deviceData.map((data) => data.voltage);
    let powers = this.deviceData.map((data) => data.power);
    let currents = this.deviceData.map((data) => data.current);
  
    if (indices.length > maxPoints) {
      indices = indices.slice(indices.length - maxPoints); // Keep only the last `maxPoints`
      voltages = voltages.slice(voltages.length - maxPoints);
      powers = powers.slice(powers.length - maxPoints);
      currents = currents.slice(currents.length - maxPoints);
    }
  
    // Helper function to calculate dynamic Y-axis range
    const calculateYAxisRange = (data: number[]) => {
      const min = Math.min(...data);
      const max = Math.max(...data);
      const buffer = (max - min) * 0.1; // Add 10% buffer to the range
      return {
        min: Math.floor(min - buffer),
        max: Math.ceil(max + buffer),
      };
    };
  
    const voltageRange = calculateYAxisRange(voltages);
    const powerRange = calculateYAxisRange(powers);
    const currentRange = calculateYAxisRange(currents);
  
    // Voltage Chart
    this.chart = new Chart(voltageCtx, {
      type: 'line',
      data: {
        labels: indices,
        datasets: [
          {
            label: 'Voltage (V)',
            data: voltages,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Voltage Over Index' },
        },
        scales: {
          x: {
            title: { display: true, text: 'Index' },
          },
          y: {
            title: { display: true, text: 'Voltage (V)' },
            ticks: {
              callback: (value) => `${value} V`, // Format Y-axis values
              stepSize: 5, // Optional: Adjust step size for better readability
            },
            min: voltageRange.min,
            max: voltageRange.max,
          },
        },
      },
    });
  
    // Power Chart
    new Chart(powerCtx, {
      type: 'line',
      data: {
        labels: indices,
        datasets: [
          {
            label: 'Power (W)',
            data: powers,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Power Over Index' },
        },
        scales: {
          x: {
            title: { display: true, text: 'Index' },
          },
          y: {
            title: { display: true, text: 'Power (W)' },
            ticks: {
              callback: (value) => `${value} W`,
            },
            min: powerRange.min,
            max: powerRange.max,
          },
        },
      },
    });
  
    // Current Chart
    new Chart(currentCtx, {
      type: 'line',
      data: {
        labels: indices,
        datasets: [
          {
            label: 'Current (A)',
            data: currents,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Current Over Index' },
        },
        scales: {
          x: {
            title: { display: true, text: 'Index' },
          },
          y: {
            title: { display: true, text: 'Current (A)' },
            ticks: {
              callback: (value) => `${value} A`,
            },
            min: currentRange.min,
            max: currentRange.max,
          },
        },
      },
    });
  }
  
  
  
  
  getAverageValue(key: string): number {
    if (!this.deviceData.length) return 0;
    const total = this.deviceData.reduce((sum, data) => sum + (data[key] || 0), 0);
    return parseFloat((total / this.deviceData.length).toFixed(2));
  }
  
}
