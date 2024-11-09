import requests
import json

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
            
            # Test POST /posts with content only
            test_create_post_content_only(token)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def test_create_post_content_only(token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Post data with content only, no image
    post_data = {
        "post": {
            "content": "This is a post with content only, no image."
        }
    }

    # Send the POST request as JSON
    response = requests.post(f"{BASE_URL}/posts", headers=headers, json=post_data)
    print("POST /posts with content only Response:", response.status_code, response.text)

    if response.status_code == 201:
        created_post = response.json()
        created_post_id = created_post.get("id")
        print("Created Post ID:", created_post_id)
    else:
        print("Failed to create post:", response.status_code, response.text)

if __name__ == "__main__":
    main()
