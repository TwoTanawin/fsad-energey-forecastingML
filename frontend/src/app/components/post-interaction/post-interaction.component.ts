import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { PostService } from '../../services/post.service';

interface Comment {
  id: number; // Comment ID for deletion purposes
  commenterName: string;
  commenterProfileImage: string;
  commentText: string;
  userId: number; // ID of the commenter
}

@Component({
  selector: 'app-post-interaction',
  templateUrl: './post-interaction.component.html',
})
export class PostInteractionComponent implements OnInit {
  @Input() postId: number = 0; // Added the missing postId input
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

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadComments();
  }

  loadUserProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
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

  loadComments(): void {
    this.postService.getCommentsForPost(this.postId).subscribe({
      next: (comments: any[]) => {
        console.log('Fetched comments:', comments); // Log fetched comments
        this.comments = comments.map((comment) => ({
          id: comment.id,
          commenterName: comment.commenter_name,
          commenterProfileImage: comment.commenter_profile_image || '/assets/images/brocode.png',
          commentText: comment.content,
          userId: comment.user_id,
        }));
      },
      error: (error) => {
        console.error('Failed to load comments:', error);
      },
    });
  }
  
  

  addComment(): void {
    if (this.newCommentText.trim()) {
      const commentData = {
        content: this.newCommentText,
        post_id: this.postId, // Ensure post_id is passed correctly
      };
      
      this.postService.addCommentToPost(this.postId, commentData).subscribe({
        next: (comment: any) => {
          this.comments.push({
            id: comment.id,
            commenterName: this.userName,
            commenterProfileImage: this.userProfileImage as string,
            commentText: this.newCommentText,
            userId: this.currentUserId,
          });
          this.newCommentText = ''; // Clear the input field
        },
        error: (error) => {
          console.error('Failed to add comment:', error);
        },
      });
    }
  }

  deleteComment(commentId: number, commentUserId: number): void {
    if (this.currentUserId === commentUserId) {
      this.postService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        },
        error: (error) => {
          console.error('Failed to delete comment:', error);
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You can only delete your own comments.',
      });
    }
  }

  toggleEdit() {
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