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

  // Fetch user profile and set profile image
  fetchUserProfile(userId: number) {
    this.authService.getUserProfile(userId).subscribe({
      next: (profileData) => {
        if (profileData) {
          this.userProfileImage = profileData.userImg && this.isBase64(profileData.userImg)
            ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profileData.userImg}`)
            : '/assets/images/brocode.png';
          this.userName = `${profileData.firstName} ${profileData.lastName}`;
        }
      },
      error: (error) => console.error('Failed to fetch profile:', error),
    });
  }

  // Decode base64 image string if it exists
  decodeBase64Image(base64String: string | undefined | null): string {
    return base64String ? `data:image/png;base64,${base64String}` : '/assets/images/brocode.png';
  }

  // Check if string is valid Base64
  private isBase64(str: string): boolean {
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Pattern.test(str);
  }

  // Create new post with content and optional image
  createPost() {
    if (!this.newPostContent && !this.newPostImage) {
      console.error('Cannot create post without content or image.');
      return;
    }

    const postData = {
      post: {
        content: this.newPostContent,
        image: this.newPostImage || null
      }
    };

    console.log("Attempting to create post with data:", postData);

    this.postService.createPost(postData).subscribe({
      next: (response) => {
        const newPost = {
          content: response.content,
          image: response.image ? this.decodeBase64Image(response.image) : null,
          timestamp: new Date().toLocaleString(),
          comments: []
        };

        this.posts.unshift(newPost);
        this.newPostContent = '';
        this.newPostImage = null;
        this.isExpanded = false;
      },
      error: (error) => console.error('Failed to create post:', error),
    });
  }

  // Load all posts from the server
  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts: any[]) => {
        console.log("Raw posts data from API:", posts); // Log raw data
        this.posts = posts.map((post: any) => ({
          id: post.id,
          content: post.content,
          owner: post.user?.firstName || 'Unknown User',
          profileImage: post.user?.user_profile?.profile_picture
            ? this.decodeBase64Image(post.user.user_profile.profile_picture)
            : '/assets/images/brocode.png',
          image: post.image ? this.decodeBase64Image(post.image) : null,
          timestamp: post.created_at || 'N/A',
          comments: post.comments || []
        }));
        console.log(posts)
        console.log("Processed posts:", this.posts); // Log processed data
      },
      error: (error: any) => console.error('Failed to load posts:', error),
    });
  }
  
  // Pin a post to move it to the top
  pinPost(postId: number) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex > -1) {
      const [pinnedPost] = this.posts.splice(postIndex, 1);
      this.posts.unshift(pinnedPost); // Move the pinned post to the top
      console.log(`Post with ID ${postId} has been pinned.`);
    }
  }

  // Delete a post by ID
  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => (this.posts = this.posts.filter((post) => post.id !== postId)),
      error: (error) => console.error('Failed to delete post:', error),
    });
  }

  // Handle image file selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.newPostImage = e.target.result);
      reader.readAsDataURL(file);
    }
  }
}
