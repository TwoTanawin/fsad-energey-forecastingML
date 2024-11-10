import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Post {
  id: number;
  content: string;
  image: string; // Ensure this is a string for compatibility
  ownerId: number;
  ownerName: string;
  ownerProfileImage: SafeUrl | string;
  timestamp: string;
  pinned: boolean;
  comments: any[];
}

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.scss']
})
export class SavedPostsComponent implements OnInit {
  isExpanded = false;
  newPostContent = '';
  newPostImage: string = ''; // Updated to always be a string
  savedPosts: Post[] = [];
  currentUserId: number = 0;
  userProfileImage: SafeUrl | string = '/assets/images/brocode.png';
  userName = 'Loading...';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId() ?? 0;
    if (this.currentUserId) {
      this.fetchUserProfile(this.currentUserId);
      this.loadSavedPosts();
    } else {
      console.error('User ID not found.');
    }
  }

  fetchUserProfile(userId: number) {
    this.authService.getUserProfile(userId).subscribe({
      next: (profileData) => {
        if (profileData) {
          this.userProfileImage = profileData.userImg && this.isBase64(profileData.userImg)
            ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${profileData.userImg}`)
            : '/assets/images/brocode.png';
          this.userName = `${profileData.firstName} ${profileData.lastName}`;
        }
      },
      error: (error) => console.error('Failed to fetch profile:', error),
    });
  }

  loadSavedPosts() {
    this.postService.getUserSavedPosts().subscribe({
      next: (posts: any[]) => {
        // Reverse the posts array to get newest to oldest
        posts.reverse().forEach(post => {
          this.authService.getUserProfile(post.user_id).subscribe({
            next: (ownerProfile) => {
              this.savedPosts.push({
                id: post.id,
                content: post.content,
                ownerId: post.user_id,
                ownerName: `${ownerProfile.firstName} ${ownerProfile.lastName}`,
                ownerProfileImage: ownerProfile.userImg
                  ? this.decodeBase64Image(ownerProfile.userImg)
                  : '/assets/images/brocode.png',
                image: post.image ? this.decodeBase64Image(post.image) : '',
                timestamp: post.created_at || 'N/A',
                comments: post.comments || [],
                pinned: post.pinned || false
              });
            },
            error: (error) => console.error(`Failed to fetch owner profile for user ${post.user_id}:`, error),
          });
        });
      },
      error: (error: any) => console.error('Failed to load saved posts:', error),
    });
  }
  
  

  private decodeBase64Image(base64String: string | undefined | null): string {
    if (!base64String) {
      return '/assets/images/brocode.png';
    }
    const cleanedBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    return `data:image/jpeg;base64,${cleanedBase64}`;
  }

  private isBase64(str: string): boolean {
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Pattern.test(str) && !str.includes(' ');
  }

  createPost() {
    if (!this.newPostContent && !this.newPostImage) {
      console.error('Cannot create post without content or image.');
      return;
    }

    const postData = {
      post: {
        content: this.newPostContent,
        image: this.newPostImage || ''
      }
    };

    this.postService.createPost(postData).subscribe({
      next: () => {
        this.loadSavedPosts(); // Refresh saved posts after creating a new one
        this.newPostContent = '';
        this.newPostImage = '';
        this.isExpanded = false;

        Swal.fire({
          icon: 'success',
          title: 'Post Created',
          text: 'Your post has been successfully created!',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => console.error('Failed to create post:', error),
    });
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.savedPosts = this.savedPosts.filter(post => post.id !== postId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Your post has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => console.error('Failed to delete post:', error),
    });
  }

  pinPost(postId: number) {
    const postIndex = this.savedPosts.findIndex(post => post.id === postId);
    if (postIndex > -1) {
      const [pinnedPost] = this.savedPosts.splice(postIndex, 1);
      pinnedPost.pinned = true;
      this.savedPosts.unshift(pinnedPost);
      Swal.fire({
        icon: 'success',
        title: 'Post Pinned',
        text: 'The post has been successfully pinned!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  updatePostContent(postId: number, updatedContent: string) {
    const post = this.savedPosts.find(p => p.id === postId);
    if (post) {
      post.content = updatedContent;
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPostImage = reader.result as string; // Convert to string
      };
      reader.readAsDataURL(file);
    }
  }
}
