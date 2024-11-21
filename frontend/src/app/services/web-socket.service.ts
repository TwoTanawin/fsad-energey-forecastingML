import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject = new Subject<any>();

  connect(deviceId: string): Observable<any> {
    // Create a new WebSocket connection to the server with the device ID
    this.socket = new WebSocket(`ws://localhost:3000/cable?device_id=${deviceId}`);

    // Handle messages received from the WebSocket
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ping") return; // Ignore ping messages
      this.subject.next(data.message); // Pass data to the Subject
    };

    // Handle errors
    this.socket.onerror = (error) => console.error("WebSocket error:", error);

    // Handle connection closure
    this.socket.onclose = () => console.warn("WebSocket connection closed");

    // Return the Subject as an Observable
    return this.subject.asObservable();
  }

  disconnect() {
    // Close the WebSocket connection if it exists
    if (this.socket) {
      this.socket.close();
    }
  }
}
