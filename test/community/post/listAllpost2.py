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
            
            # List all posts with user details
            list_all_posts_with_user_details(token)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def list_all_posts_with_user_details(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Fetch all posts
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    if response.status_code == 200:
        posts = response.json()
        print("GET /posts Response:", response.status_code)

        # Print details of each post along with user information
        for post in posts:
            post_id = post.get("id")
            content = post.get("content")
            user_id = post.get("user_id")  # Assuming 'user_id' holds the ID of the user
            
            # Fetch user details
            user_details = fetch_user_details(user_id, headers)
            if user_details:
                first_name = user_details.get("firstName")
                last_name = user_details.get("lastName")
                user_img = user_details.get("userImg")

                print(f"Post ID: {post_id}")
                print(f"Content: {content}")
                print(f"Author: {first_name} {last_name}")
                print(f"User Image: {user_img}")
            else:
                print(f"Post ID: {post_id} - Failed to fetch user details.")
            
            # Check for post image
            if post.get("image"):
                print("This post contains an image.")
            else:
                print("This post has no image.")
            print("-" * 30)  # Separator for readability
    else:
        print("Failed to fetch posts:", response.status_code, response.text)

def fetch_user_details(user_id, headers):
    # Fetch user details by user ID
    response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch user details for user ID {user_id}:", response.status_code, response.text)
        return None

if __name__ == "__main__":
    main()
