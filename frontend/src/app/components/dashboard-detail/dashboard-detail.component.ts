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
    const ctx = document.getElementById('deviceDataChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Chart canvas element not found.');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const timestamps = this.deviceData.map((data) =>
      new Date(data.created_at).toLocaleString()
    );
    const voltages = this.deviceData.map((data) => data.voltage);
    const powers = this.deviceData.map((data) => data.power);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Voltage (V)',
            data: voltages,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
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
          legend: { display: true, position: 'top' },
          title: { display: true, text: 'Device Metrics Over Time' },
        },
        scales: {
          x: { type: 'category', title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true },
        },
      },
    });
  }
}
