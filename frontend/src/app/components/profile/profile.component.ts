import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  id: number | null = null;
  email: string = ''; 
  firstName: string = '';
  lastName: string = '';
  profilePicture: SafeUrl | string = '/assets/images/brocode.png';  // Default image
  private profilePictureBase64: string = '';

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Use AuthService to retrieve the current user ID
    this.id = this.authService.getCurrentUserId();
    console.log("profile component : ")
    console.log(this.id)
    if (this.id) {
      this.fetchUserProfile(this.id);
    } else {
      console.error('User ID not found');
    }
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (this.id) {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userImg: this.profilePictureBase64 // Send Base64-encoded image
      };
      this.authService.updateUserProfile(this.id, userData).subscribe({
        next: () => {
          console.log('Profile updated successfully');
          this.toggleEditMode(); // Exit edit mode after saving
        },
        error: (err) => console.error('Error updating profile:', err)
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePictureBase64 = reader.result as string;
        this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(this.profilePictureBase64); // Display image preview
      };
      reader.readAsDataURL(file); // Encode image to Base64
    }
  }

  private fetchUserProfile(userId: number): void {
    this.authService.getUserProfile(userId).subscribe({
      next: (data) => {
        console.log(data)
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        this.profilePicture = data.userImg && this.isBase64(data.userImg) 
          ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImg}`)
          : '/assets/images/brocode.png';
      },
      error: (err) => console.error('Error fetching user profile:', err)
    });
  }

  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
}
