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
            
            # Test GET /save_posts
            test_get_save_posts(token)

            # Test POST /save_posts
            test_create_save_post(token, user_id)

            # Test PUT /save_posts/:id
            valid_save_post_id = get_valid_save_post_id(token)
            if valid_save_post_id:
                test_update_save_post(token, valid_save_post_id)
            else:
                print("No valid save_post_id found for update.")
            
            # Test DELETE /save_posts/:id
            # test_delete_save_post(token, 1)  # Replace 1 with an actual save post ID
        else:
            print("Login successful, but token or user ID not found.")
    else:
        print("Login failed. Unable to test protected endpoint.")

def test_get_save_posts(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/save_posts", headers=headers)
    print("GET /save_posts Response:", response.status_code, response.text)

def test_create_save_post(token, user_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    save_post_data = {
        "post_id": 1,  # Replace with a valid post ID
        "user_id": user_id  # Use current user ID from login response
    }
    response = requests.post(f"{BASE_URL}/save_posts", headers=headers, json=save_post_data)
    print("POST /save_posts Response:", response.status_code, response.text)

def test_update_save_post(token, save_post_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    update_data = {
        "post_id": 1  # Replace with an updated post ID if needed
    }
    response = requests.put(f"{BASE_URL}/save_posts/{save_post_id}", headers=headers, json=update_data)
    print(f"PUT /save_posts/{save_post_id} Response:", response.status_code, response.text)

def get_valid_save_post_id(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/save_posts", headers=headers)
    if response.status_code == 200:
        save_posts = response.json()
        if save_posts:
            return save_posts[0].get("id")  # Return the ID of the first save post found
    return None

def test_delete_save_post(token, save_post_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.delete(f"{BASE_URL}/save_posts/{save_post_id}", headers=headers)
    print(f"DELETE /save_posts/{save_post_id} Response:", response.status_code)

if __name__ == "__main__":
    main()
