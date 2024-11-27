import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private apiKey = 'AIzaSyAdLHuAuMfdp83MB5EHXDwCOkqJjneNy1o'; // Replace with your API key

  constructor(private http: HttpClient) { }

  getLatLng(address: string): Observable<{ lat: number; lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const location = response.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      })
    );
  }
}
