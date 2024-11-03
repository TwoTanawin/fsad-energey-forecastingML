import requests

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
            
            # Test GET /likes
            test_get_likes(token)

            # Test POST /likes
            test_create_like(token, user_id)

            # Test PUT /likes/:id
            # test_update_like(token, 1)  # Replace 1 with an actual like ID

            # Test DELETE /likes/:id
            # test_delete_like(token, 1)  # Replace 1 with an actual like ID
        else:
            print("Login successful, but token or user ID not found.")
    else:
        print("Login failed. Unable to test protected endpoint.")

def test_get_likes(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/likes", headers=headers)
    print("GET /likes Response:", response.status_code, response.text)

def test_create_like(token, user_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Fetch a valid post ID
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    if response.status_code == 200:
        posts = response.json()
        if len(posts) > 0:
            post_id = posts[0].get("id")  # Get the ID of the first post
            print(f"Using post ID: {post_id} for the like")
        else:
            print("No posts available to like.")
            return
    else:
        print("Failed to fetch posts. Cannot proceed with creating a like.")
        return

    like_data = {
        "isLiked": True,
        "post_id": post_id,  # Use the fetched post ID
        "user_id": user_id  # Use current user ID from login response
    }
    response = requests.post(f"{BASE_URL}/likes", headers=headers, json=like_data)
    print("POST /likes Response:", response.status_code, response.text)


def test_update_like(token, like_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    update_data = {
        "isLiked": False  # Update the like status as needed
    }
    response = requests.put(f"{BASE_URL}/likes/{like_id}", headers=headers, json=update_data)
    print(f"PUT /likes/{like_id} Response:", response.status_code, response.text)

def test_delete_like(token, like_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.delete(f"{BASE_URL}/likes/{like_id}", headers=headers)
    print(f"DELETE /likes/{like_id} Response:", response.status_code)

if __name__ == "__main__":
    main()
