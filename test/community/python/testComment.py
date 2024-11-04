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
            
            # Test GET /comments
            test_get_comments(token)

            # Test POST /comments
            test_create_comment(token, user_id, 1)  # Replace 1 with the actual post ID to comment on

            # Test PUT /comments/:id
            test_update_comment(token, 1)  # Replace 1 with an actual comment ID

            # Test DELETE /comments/:id
            # test_delete_comment(token, 1)  # Replace 1 with an actual comment ID
        else:
            print("Login successful, but token or user ID not found.")
    else:
        print("Login failed. Unable to test protected endpoint.")

def test_get_comments(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/comments", headers=headers)
    print("GET /comments Response:", response.status_code, response.text)

def test_create_comment(token, user_id, post_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    comment_data = {
        "content": "This is a new comment",
        "post_id": post_id,  # Use the provided post ID
        "user_id": user_id  # Use current user ID from login response
    }
    response = requests.post(f"{BASE_URL}/comments", headers=headers, json=comment_data)
    print("POST /comments Response:", response.status_code, response.text)

def test_update_comment(token, comment_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    update_data = {
        "content": "test Updated comment content"
    }
    response = requests.put(f"{BASE_URL}/comments/{comment_id}", headers=headers, json=update_data)
    print(f"PUT /comments/{comment_id} Response:", response.status_code, response.text)

def test_delete_comment(token, comment_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.delete(f"{BASE_URL}/comments/{comment_id}", headers=headers)
    print(f"DELETE /comments/{comment_id} Response:", response.status_code)

if __name__ == "__main__":
    main()