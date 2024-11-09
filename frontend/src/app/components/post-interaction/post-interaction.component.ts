import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


interface Comment {
  commenterName: string;
  commenterProfileImage: string;
  commentText: string;
}

@Component({
  selector: 'app-post-interaction',
  templateUrl: './post-interaction.component.html',
})
export class PostInteractionComponent implements OnInit {
  @Input() postContent: string = '';
  @Input() postImage: string = ''; // Optional post image
  @Input() postOwner: string = '';
  @Input() postOwnerId: number = 0; // ID of the post owner
  @Input() currentUserId: number = 0; // ID of the logged-in user
  @Input() profileImage: SafeUrl | string = '/assets/images/brocode.png';
  @Input() timestamp: string = '';

  isEditing = false;
  comments: Comment[] = [];
  newCommentText: string = '';

  // User Profile Information
  userProfileImage: SafeUrl | string = '/assets/images/brocode.png';
  userName: string = '';

  @Output() deletePost = new EventEmitter<void>();
  @Output() pinPost = new EventEmitter<void>();
  @Output() updatePostContent = new EventEmitter<string>();

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('Post Owner ID on Init:', this.postOwnerId);
    this.loadUserProfile();
  }

  // Fetch current user information
  loadUserProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId
      this.authService.getUserProfile(userId).subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.userProfileImage = profile.userImg
            ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profile.userImg}`)
            : '/assets/images/brocode.png'; // Fallback image
        },
        error: (error) => {
          console.error('Failed to fetch profile:', error);
        }
      });
    }
  }

  // Adding a new comment
  addComment() {
    if (this.newCommentText.trim()) {
      const newComment: Comment = {
        commenterName: this.userName,
        commenterProfileImage: typeof this.userProfileImage === 'string'
          ? this.userProfileImage
          : (this.userProfileImage as SafeUrl).toString(), // Convert SafeUrl to string if necessary
        commentText: this.newCommentText,
      };
      this.comments.push(newComment);
      this.newCommentText = ''; // Reset comment input
    }
  }

  toggleEdit() {
    console.log('Current User ID:', this.currentUserId);
    console.log('Post Owner ID:', this.postOwnerId);
  
    if (this.currentUserId && this.currentUserId === this.postOwnerId) {
      this.isEditing = !this.isEditing;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You can only edit your own posts.',
      });
    }
  }
  

  saveEdit(updatedContent: string) {
    if (this.currentUserId === this.postOwnerId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updatePostContent.emit(updatedContent);
          this.isEditing = false;
  
          Swal.fire({
            icon: 'success',
            title: 'Updated',
            text: 'Your post has been successfully updated!',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    }
  }
  

  likePost() {
    console.log('Post liked!');
  }

  sharePost() {
    console.log('Post shared!');
  }

  delete() {
    this.deletePost.emit();
  }

  pin() {
    this.pinPost.emit();
  }
}