import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id: number | null = null;  // Variable to store the userId (references :user)
  email: string = ''; 

  isEditing = false;
  profilePicture: SafeUrl | string = '/assets/images/brocode.png';  // Default image
  profile = {
    username: '',
    email: '',
    userImg: ''
  };

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        this.id = user.id;
        console.log('User ID:', this.id);  
        this.email = user.email;  // Assuming this comes from a different API than UserProfile 
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
        alert('Failed to fetch user info');
      }
    });
  }

  fetchUserProfile(): void {
    if (this.id !== null) {  // Check if this.id is not null
      this.authService.getUserProfile(this.id).subscribe(
        (data) => {
          console.log("Fetching user profile with ID:", this.id);
          this.profile.username = data.username;
          this.profile.email = data.email;
          this.profilePicture = data.userImg
            ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImg}`)
            : '/assets/images/brocode.png';
        },
        (error) => {
          console.log("Error fetching user profile for ID:", this.id);
          console.error("Error fetching user info:", error);
        }
      );
    } else {
      console.error("User ID is null, cannot fetch user profile.");
    }
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result?.toString();
        if (base64String) {
          this.profile.userImg = base64String.split(',')[1];
          this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.id !== null) {  // Check if this.id is not null
      const updatedProfile = {
        username: this.profile.username,
        email: this.profile.email,
        userImg: this.profile.userImg
      };
  
      this.authService.updateUserProfile(this.id, updatedProfile).subscribe(
        (response) => {
          console.log("Profile updated successfully:", response);
          this.isEditing = false;
        },
        (error) => {
          console.log("Error updating profile for ID:", this.id);
          console.error("Error updating profile:", error);
        }
      );
    } else {
      console.error("User ID is null, cannot update profile.");
    }
  }
}
