import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  createPost(postData: { post: { content: string; image: string | null } }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/posts`, postData, { headers: this.getAuthHeaders() });
  }


  updatePost(postId: number, updatedData: { post: { content: string; image: string | null } }): Observable<any> {
    return this.http.put(`${this.BASE_URL}/posts/${postId}`, updatedData, { headers: this.getAuthHeaders() });
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/posts/${postId}`, { headers: this.getAuthHeaders() });
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/posts/${postId}`, { headers: this.getAuthHeaders() });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/posts`, { headers: this.getAuthHeaders() });
  }

  // getCommentsForPost(postId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.BASE_URL}/posts/${postId}/comments`, { headers: this.getAuthHeaders() });
  // }

  // addCommentToPost(commentData: { content: string; postId: number }): Observable<any> {
  //   return this.http.post(`${this.BASE_URL}/posts/${commentData.postId}/comments`, commentData, { headers: this.getAuthHeaders() });
  // }
  // addCommentToPost(postId: number, commentData: { content: string; post_id: number }): Observable<Comment> {
  //   return this.http.post<Comment>(`${this.BASE_URL}/posts/${postId}/comments`, commentData);
  // }
  addCommentToPost(postId: number, commentData: { content: string; post_id: number }): Observable<Comment> {
    const token = this.authService.getToken(); // Assume getToken() returns the stored token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Comment>(`${this.BASE_URL}/posts/${postId}/comments`, commentData, { headers });
  }

  getCommentsForPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/comments?post_id=${postId}`, { headers: this.getAuthHeaders() });
  }


  // Assuming you are using a method like this to create a comment
  addComment(postId: number, content: string) {
    const commentData = {
      content: content,
      post_id: postId  // Use "post_id" instead of "postId"
    };

    return this.http.post(`http://localhost:3000/posts/${postId}/comments`, { comment: commentData });
  }



  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/comments/${commentId}`, { headers: this.getAuthHeaders() });
  }

}
