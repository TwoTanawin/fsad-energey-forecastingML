import requests
import os

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

def main():
    # Login data
    login_data = {
        "email": "gogo@Gogo.com",
        "password": "securepassword"
    }

    # Perform login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        json_response = response.json()
        token = json_response.get("token")

        if token:
            print("Login successful.")
            print("JWT Token:", token)
            
            # List all posts
            list_all_posts(token)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def list_all_posts(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Fetch all posts
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    if response.status_code == 200:
        posts = response.json()
        print("GET /posts Response:", response.status_code)

        # Print details of each post
        for post in posts:
            post_id = post.get("id")
            content = post.get("content")
            author = post.get("user_id")  # Assuming 'author' field holds user info
            
            print(f"Post ID: {post_id}")
            print(f"Content: {content}")
            print(f"Author: {author}")
            if post.get("image"):
                print("This post contains an image.")
            else:
                print("This post has no image.")
            print("-" * 30)  # Separator for readability
    else:
        print("Failed to fetch posts:", response.status_code, response.text)

if __name__ == "__main__":
    main()
