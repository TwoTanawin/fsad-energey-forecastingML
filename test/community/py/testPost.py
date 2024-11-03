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
        print("Login Response:", response.status_code, response.text)
        json_response = response.json()
        token = json_response.get("token")
        user = json_response.get("user", {})
        user_id = user.get("id", -1)

        if token and user_id != -1:
            print("JWT Token:", token)
            print("User ID (PK):", user_id)  # Print current user ID (PK)
            
            # Test GET /posts
            test_get_posts(token)

            # Test POST /posts
            test_create_post(token, user_id)

            # Use the current user ID in test_update_post
            # test_update_post(token, user_id)
        else:
            print("Login successful, but token or user ID not found.")
    else:
        print("Login failed. Unable to test protected endpoint.")

def test_get_posts(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    print("GET /posts Response:", response.status_code, response.text)

def test_create_post(token, user_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    post_data = {
        "content": "This is a new post",
        "image": "Optional image data",
        "user_id": user_id  # Use current user ID from login response
    }
    response = requests.post(f"{BASE_URL}/posts", headers=headers, json=post_data)
    print("POST /posts Response:", response.status_code, response.text)

def test_update_post(token, user_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    update_data = {
        "content": "Updated content Hello XI",
        "image": "Updated image data Dammm"
    }
    # Use the current user ID in the endpoint if needed
    response = requests.put(f"{BASE_URL}/posts/{user_id}", headers=headers, json=update_data)
    print(f"PUT /posts/{user_id} Response:", response.status_code, response.text)

if __name__ == "__main__":
    main()