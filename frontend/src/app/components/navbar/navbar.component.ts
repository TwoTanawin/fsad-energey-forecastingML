import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  profileMenuOpen = false;
  profileImage: string = '';  // This will store the decoded profile image

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // this.fetchUserProfile();
  }

  // // Fetch the user profile data and decode the profile image
  // fetchUserProfile() {
  //   const token = localStorage.getItem('token'); // Retrieve the token from storage
  //   if (token) {
  //     this.authService.getUserProfile(token).subscribe({
  //       next: (profileData) => {
  //         if (profileData && profileData.userImg) {
  //           this.profileImage = this.decodeBase64Image(profileData.userImg);
  //         } else {
  //           // If no profile picture, use a default image
  //           this.profileImage = 'https://flowbite.com/application-ui/demo/images/users/jese-leos-2x.png';
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Failed to fetch user profile:', error);
  //       }
  //     });
  //   } else {
  //     console.error('No token found, unable to fetch user profile.');
  //   }
  // }

  // Decode Base64 image
  decodeBase64Image(base64String: string): string {
    return `data:image/png;base64,${base64String}`;
  }

  // Toggle the dropdown menu
  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // Close the dropdown menu when an item is clicked
  closeProfileMenu() {
    this.profileMenuOpen = false;
  }
}
