import requests

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
            
            # Test saving post with post_id 5
            post_id = 5
            test_save_post(token, post_id)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def test_save_post(token, post_id):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Save post data
    save_post_data = {
        "save_post": {
            "post_id": post_id
        }
    }

    # Send the POST request to save the post
    response = requests.post(f"{BASE_URL}/save_posts", headers=headers, json=save_post_data)
    print("POST /save_posts Response:", response.status_code, response.text)

    if response.status_code == 201:
        saved_post = response.json()
        saved_post_id = saved_post.get("id")
        print("Saved Post ID:", saved_post_id)
    elif response.status_code == 422:
        print("Already saved this post or invalid data:", response.json())
    else:
        print("Failed to save post:", response.status_code, response.text)

if __name__ == "__main__":
    main()
