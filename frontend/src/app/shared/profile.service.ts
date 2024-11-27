import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileImageSource = new BehaviorSubject<string>('/assets/images/brocode.png'); // Default image
  profileImage$ = this.profileImageSource.asObservable();

  updateProfileImage(newImage: string) {
    this.profileImageSource.next(newImage);
  }
}
