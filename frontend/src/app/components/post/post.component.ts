import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    console.log("post component : ", this.userId);
    
    if (this.userId) {
      this.fetchUserProfile(this.userId);
      this.loadPosts();
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

  decodeBase64Image(base64String: string | undefined | null): SafeUrl | string {
    if (!base64String) {
      return '/assets/images/brocode.png';
    }
  
    // Remove any existing 'data:image/jpeg;base64,' prefix to avoid duplication
    const cleanedBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  
    // Return the sanitized URL with a single 'data:image/jpeg;base64,' prefix
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${cleanedBase64}`);
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
        image: this.postImageBase64 ? `data:${this.postImageMimeType};base64,${this.postImageBase64}` : ''
      }
    };
  
    console.log("Attempting to create post with data:", postData);
  
    this.postService.createPost(postData).subscribe({
      next: (response) => {
        // Prepare the new post data with the decoded image
        const newPost = {
          content: response.content,
          image: response.image ? this.decodeBase64Image(response.image) : '', 
          timestamp: new Date().toLocaleString(),
          comments: []
        };
  
        // Add the new post to the beginning of the posts array
        this.posts.unshift(newPost);
  
        // Reset form inputs
        this.newPostContent = '';
        this.newPostImage = '';
        this.isExpanded = false;
        this.resetForm();
  
        // Optionally, reload posts to keep the list updated
        this.loadPosts();
      },
      error: (error) => console.error('Failed to create post:', error),
    });
  }
  

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts: any[]) => {
        console.log("Raw posts data:", posts);

        this.posts = posts.map((post: any) => {
          console.log("Post ID:", post.id, "Image Data:", post.image);

          const profileImage = post.user?.userImg
            ? this.decodeBase64Image(post.user.userImg)
            : '/assets/images/brocode.png';

          const postImage = post.image
            ? this.decodeBase64Image(post.image)
            : ''; 

          console.log("Decoded Post Image:", postImage);

          return {
            id: post.id,
            content: post.content,
            owner: post.user?.firstName || 'Unknown User',
            profileImage: profileImage,
            image: postImage, 
            timestamp: post.created_at || 'N/A',
            comments: post.comments || []
          };
        });
      },
      error: (error: any) => console.error('Failed to load posts:', error),
    });
  }
  
  pinPost(postId: number) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex > -1) {
      const [pinnedPost] = this.posts.splice(postIndex, 1);
      this.posts.unshift(pinnedPost);
      console.log(`Post with ID ${postId} has been pinned.`);
    }
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => (this.posts = this.posts.filter((post) => post.id !== postId)),
      error: (error) => console.error('Failed to delete post:', error),
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.postImageMimeType = file.type; // Store the MIME type
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        
        // Remove the data prefix and only keep the base64 string
        this.postImageBase64 = result.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        
        // Preview the image
        this.postImage = this.sanitizer.bypassSecurityTrustUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      this.postImageBase64 = '';  // No image selected
      this.postImage = '/assets/images/default-post.png';  // Use default image
    }
  }

  private resetForm(): void {
    this.content = '';
    this.postImage = '/assets/images/default-post.png';
    this.postImageBase64 = '';
    this.postImageMimeType = ''; // Reset MIME type
  }
}
