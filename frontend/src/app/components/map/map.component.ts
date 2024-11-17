import { Component, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default center
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral | null = null;
  showInfoWindow = false;
  markerAddress = '';

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {
    const address = '1518 Pracharat 1 Road, Wongsawang, Bangsue, Bangkok 10800';
    this.geocodingService.getLatLng(address).subscribe({
      next: (location) => {
        this.center = location; // Update the map center
        this.markerPosition = location; // Set the marker position
        this.markerAddress = address; // Store the marker's address
      },
      error: (err) => {
        console.error('Failed to fetch coordinates:', err);
      }
    });
  }

  onMarkerClick(): void {
    this.showInfoWindow = true;
  }

  closeInfoWindow(): void {
    this.showInfoWindow = false;
  }
}
