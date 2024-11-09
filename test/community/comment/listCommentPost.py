import requests
import base64
import os

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

def main():
    # Login data
    login_data = {
        "email": "gogo@Gogo.com",  # Replace with the actual email
        "password": "securepassword"  # Replace with the actual password
    }

    # Perform login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        json_response = response.json()
        token = json_response.get("token")

        if token:
            print("Login successful.")
            print("JWT Token:", token)
            
            # List post details and comments for post_id 5
            post_id = 1
            list_post_and_comments(token, post_id)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def list_post_and_comments(token, post_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Fetch post details
    post_response = requests.get(f"{BASE_URL}/posts/{post_id}", headers=headers)
    if post_response.status_code == 200:
        post = post_response.json()
        content = post.get("content", "No content available")
        encoded_image = post.get("image")

        print(f"\nPost ID: {post_id}")
        print(f"Content: {content}")
        
        # Check if the post has an image
        if encoded_image:
            try:
                # Decode the image just to verify it's valid
                base64.b64decode(encoded_image)
                print("Image: Available")
            except Exception as e:
                print(f"Image: N/A (error decoding image: {e})")
        else:
            print("Image: N/A")

    else:
        print(f"Failed to fetch post {post_id} details:", post_response.status_code, post_response.text)
        return

    # Fetch comments for the post
    comments_response = requests.get(f"{BASE_URL}/comments?post_id={post_id}", headers=headers)
    if comments_response.status_code == 200:
        comments = comments_response.json()
        print(f"\nComments for Post ID {post_id}:")
        
        # List each comment's content
        if comments:
            for comment in comments:
                comment_id = comment.get("id")
                content = comment.get("content", "No content")
                print(f"Comment ID: {comment_id}, Content: {content}")
        else:
            print("No comments found for this post.")
    else:
        print(f"Failed to fetch comments for post {post_id}:", comments_response.status_code, comments_response.text)

if __name__ == "__main__":
    main()
