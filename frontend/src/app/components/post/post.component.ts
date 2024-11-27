import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../../shared/profile.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  isExpanded = false;
  newPostContent = '';
  newPostImage: string | null = null;
  posts: any[] = [];
  newCommentContent = '';
  userProfileImage: SafeUrl | string = '/assets/images/brocode.png';
  userName = 'Loading...';
  userId: number | null = null;

  content: string = '';  // Post content
  postImage: SafeUrl | string = '/assets/images/default-post.png'; // Default image for preview
  private postImageBase64: string = '';  // Base64 for backend submission
  private postImageMimeType: string = '';  // Store MIME type for Base64 encoding

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId() ?? 0;
    console.log("post component : ", this.userId);
    
    if (this.userId) {
      this.fetchUserProfile(this.userId);
      this.loadPosts();
    } else {
      console.error('User ID not found.');
    }

    this.profileService.profileImage$.subscribe((newImage) => {
      this.userProfileImage = newImage; // Update user profile image dynamically
    });
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

  decodeBase64Image(base64String: string | undefined | null): SafeUrl | string {
    if (!base64String) {
      return '/assets/images/brocode.png';
    }
  
    const cleanedBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${cleanedBase64}`);
  }
  

  private isBase64(str: string): boolean {
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Pattern.test(str) && !str.includes(' ');
  }  

  createPost() {
    if (this.newPostContent.trim().length > 200) {
      Swal.fire({
        icon: 'error',
        title: 'Content Too Long',
        text: 'Post content cannot exceed 200 characters.',
      });
      return;
    }
  
    if (!this.newPostContent.trim() && !this.newPostImage) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Post',
        text: 'You cannot create an empty post.',
      });
      return;
    }
  
    const postData = {
      post: {
        content: this.newPostContent,
        image: this.postImageBase64 ? `data:${this.postImageMimeType};base64,${this.postImageBase64}` : ''
      }
    };
  
    this.postService.createPost(postData).subscribe({
      next: (response) => {
        const newPost = {
          id: response.id,
          content: response.content,
          image: response.image ? this.decodeBase64Image(response.image) : '', 
          ownerId: this.userId,
          timestamp: new Date().toLocaleString(),
          comments: [],
          pinned: false
        };
  
        this.posts.unshift(newPost);
        this.newPostContent = '';
        this.newPostImage = '';
        this.isExpanded = false;
        this.resetForm();
        this.loadPosts();

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

  updatePostContent(postId: number, updatedContent: string) {
    const updatedData = {
      post: {
        content: updatedContent,
        image: null,
      },
    };
    this.postService.updatePost(postId, updatedData).subscribe({
      next: (response) => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.content = response.content;
        }
      },
      error: (error) => console.error('Failed to update post:', error),
    });
  }
  
  deletePost(postId: number) {
    const post = this.posts.find((p) => p.id === postId);
    if (post?.ownerId !== this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You can only delete your own posts.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe({
          next: () => {
            this.posts = this.posts.filter((post) => post.id !== postId);
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
    });
  }

  updatePost(postId: number, updatedContent: string, updatedImage?: string) {
    const post = this.posts.find((p) => p.id === postId);
    if (post?.ownerId !== this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You can only update your own posts.',
      });
      return;
    }
  
    const token = localStorage.getItem('authToken');  // Retrieve token, or use AuthService if applicable
    const updatedData = {
      post: {
        content: updatedContent,
        image: updatedImage ? `data:${this.postImageMimeType};base64,${this.postImageBase64}` : post.image
      }
    };
  
    console.log('Updating post with data:', updatedData);
  
    this.postService.updatePost(postId, updatedData).subscribe({
      next: (response) => {
        post.content = response.content;
        post.image = response.image ? this.decodeBase64Image(response.image) : post.image;
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Your post has been updated.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Failed to update post:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an issue updating the post. Please try again.',
        });
      },
    });
  }
  

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts: any[]) => {
        posts.forEach(post => {
          console.log('Checking post.user:', post.user);  // Log the user object
          console.log('Checking post.user.id:', post.user_id);  // Log the user ID
        });
  
        this.posts = posts.map((post: any) => ({
          id: post.id,
          content: post.content,
          ownerId: post.user_id, // Attempt to access post.user.id
          owner: post.user?.firstName || 'Unknown User',
          profileImage: post.user?.userImg ? this.decodeBase64Image(post.user.userImg) : '/assets/images/brocode.png',
          image: post.image ? this.decodeBase64Image(post.image) : '',
          timestamp: post.created_at || 'N/A',
          comments: post.comments || [],
          pinned: post.pinned || false
        }));
      },
      error: (error: any) => console.error('Failed to load posts:', error),
    });
  }
  
  

  pinPost(postId: number) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex > -1) {
      const [pinnedPost] = this.posts.splice(postIndex, 1);
      pinnedPost.pinned = true;
      this.posts.unshift(pinnedPost);
      Swal.fire({
        icon: 'success',
        title: 'Post Pinned',
        text: 'The post has been successfully pinned!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.postImageMimeType = file.type;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.postImageBase64 = result.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        this.postImage = this.sanitizer.bypassSecurityTrustUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      this.postImageBase64 = '';
      this.postImage = '/assets/images/default-post.png';
    }
  }

  

  private resetForm(): void {
    this.content = '';
    this.postImage = '/assets/images/default-post.png';
    this.postImageBase64 = '';
    this.postImageMimeType = '';
  }
}
