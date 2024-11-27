import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { Chart, registerables } from 'chart.js';
import { PostService } from '../../services/post.service';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  deviceData: any[] = []; // Metrics from the device
  chart: any; // Reference to the Chart.js instance
  forecastedValue: number = 0; // Dummy forecasted value with noise
  newAddress: string = ''; // New address for update
  deviceId: string | null = null; // Device ID from route
  isUpdateAddressVisible: boolean = false;

  province: string = '';
  district: string = '';
  subDistrict: string = '';
  postcode: string = '';
  country: string = '';

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    Chart.register(...registerables); // Register all required Chart.js components
    const deviceId = this.route.snapshot.paramMap.get('device_id');
    console.log('Device ID:', deviceId);
    if (deviceId) {
      this.deviceId = deviceId;
      this.logDeviceTokenAndFetchDetails(deviceId);
    } else {
      console.error('Device ID is missing in the route.');
    }
  }

  logDeviceTokenAndFetchDetails(deviceId: string): void {
    this.deviceService.getTokenByDeviceId(deviceId).subscribe({
      next: (response) => {
        console.log("Token Response:", response);
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
        console.log("Device Data Response:", response);
        if (response && response.data) {
          this.deviceData = response.data;
          this.calculateForecastedValue();
          console.log("Device Data Array:", JSON.stringify(this.deviceData, null, 2));
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
  
  calculateForecastedValue(): void {
    if (!this.deviceData.length) {
      this.forecastedValue = 0;
      return;
    }
    const basePrediction = this.getAverageValue('electricPrice') * 1.1; // Base prediction logic
    const noise = (Math.random() - 0.5) * 0.2 * basePrediction; // Add random noise
    this.forecastedValue = parseFloat((basePrediction + noise).toFixed(2));
  }
  
  
  
  isExpanded = false; // Tracks whether the post creation modal is open
  newPostContent = ''; // Content of the new post
  newPostImage: string | null = null; // Image for the new post
  userProfileImage: string = '/assets/images/default-profile.png'; // Default profile image
  userName: string = 'User'; // Default user name
  
  capturedDetails: string = ''; 
  
  captureAndPostDeviceDetails(): void {
    if (!this.deviceData || this.deviceData.length === 0) {
      console.error('No device data to capture.');
      Swal.fire({
        icon: 'error',
        title: 'No Data',
        text: 'No device data available to share.',
      });
      return;
    }
  
    const now = new Date().toLocaleString();
  
    // Generate captured details
    this.capturedDetails = `
      Captured on ${now} | Avg Frequency: ${this.getAverageValue('frequency')} Hz, Avg PF: ${this.getAverageValue('PF')}, Avg Price: ${this.getAverageValue('electricPrice')} $
    `.trim();
  
    this.newPostContent = this.capturedDetails; // Pre-fill the content
    this.isExpanded = true; // Show the modal
  }
  
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPostImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  createPost(): void {
    if (!this.newPostContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Content',
        text: 'Post content cannot be empty.',
      });
      return;
    }
  
    // Ensure capturedDetails is not duplicated
    const finalContent = this.newPostContent.includes(this.capturedDetails)
      ? this.newPostContent.trim() // Use as-is if already appended
      : `${this.newPostContent.trim()} ${this.capturedDetails.trim()}`; // Append if missing
  
    const postData = {
      post: {
        content: finalContent,
        image: this.newPostImage || null, // Include the image if provided
      },
    };
  
    this.postService.createPost(postData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
  
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Post Created',
          text: 'Your post has been successfully created!',
          timer: 2000,
          showConfirmButton: false,
        });
  
        this.resetPostForm(); // Reset the form after posting
      },
      error: (err) => {
        console.error('Error creating post:', err);
  
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Post Failed',
          text: 'Failed to create post. Please try again later.',
        });
  
        if (err.error) {
          console.error('Backend Error:', err.error); // Log backend error response
        }
      },
    });
  }
  
  resetPostForm(): void {
    this.isExpanded = false;
    this.newPostContent = '';
    this.newPostImage = null;
  }

  showUpdateAddressModal(): void {
    this.isUpdateAddressVisible = true;
  }

  hideUpdateAddressModal(): void {
    this.isUpdateAddressVisible = false;
  }

  

  updateDeviceAddress(): void {
    if (!this.deviceId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Device ID is missing. Please try again.',
      });
      return;
    }
  
    // Combine all fields into a single string for the address
    const address = [
      this.province,
      this.district,
      this.subDistrict,
      this.postcode,
      this.country,
    ]
      .filter(Boolean) // Remove empty fields
      .join(', '); // Combine with commas
  
    console.log('Device ID:', this.deviceId);
    console.log('Address Payload:', address);
  
    // Fetch the token from the backend
    this.deviceService.getTokenByDeviceId(this.deviceId).subscribe({
      next: (response) => {
        console.log("Token Response:", response);
        if (response && response.token) {
          // Cast this.deviceId to string since it's already checked
          this.submitUpdatedAddress(this.deviceId as string, address, response.token);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Token not received. Please try again later.',
          });
        }
      },
      error: (err) => {
        console.error('Error fetching token:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch the device token. Try again.',
        });
      },
    });
  }
  
  submitUpdatedAddress(deviceId: string, address: string, token: string): void {
    this.deviceService.updateDeviceAddress(deviceId, address, token).subscribe({
      next: (response) => {
        console.log('Update Response:', response); 
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Device address updated successfully!',
        });
        this.isUpdateAddressVisible = false; // Hide the form
      },
      error: (err) => {
        console.error('Error updating address:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update device address. Try again.',
        });
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
  
    new Chart(voltageCtx, {
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
          x: { title: { display: true, text: 'Index' } },
          y: {
            title: { display: true, text: 'Voltage (V)' },
            min: voltageRange.min,
            max: voltageRange.max,
          },
        },
      },
    });
  
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
          x: { title: { display: true, text: 'Index' } },
          y: {
            title: { display: true, text: 'Power (W)' },
            min: powerRange.min,
            max: powerRange.max,
          },
        },
      },
    });
  
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
          x: { title: { display: true, text: 'Index' } },
          y: {
            title: { display: true, text: 'Current (A)' },
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
