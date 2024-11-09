import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

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
  

  updatePost(postId: number, updatedData: { caption: string; pinned: boolean }): Observable<any> {
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

  getCommentsForPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/posts/${postId}/comments`, { headers: this.getAuthHeaders() });
  }
  
  addCommentToPost(commentData: { content: string; postId: number }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/posts/${commentData.postId}/comments`, commentData, { headers: this.getAuthHeaders() });
  }
  
}
