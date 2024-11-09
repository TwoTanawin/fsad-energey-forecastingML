import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

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

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Fetch current user information
  loadUserProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
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
    this.isEditing = !this.isEditing;
  }

  saveEdit(updatedContent: string) {
    this.postContent = updatedContent;
    this.isEditing = false;
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
