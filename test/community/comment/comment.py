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
            
            # Test POST /comments for post_id 5
            post_id = 2
            test_create_comment(token, post_id)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def test_create_comment(token, post_id):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Comment data
    comment_data = {
        "comment": {
            "content": "This is a comment on post 5.",
            "post_id": post_id
        }
    }

    # Send the POST request as JSON
    response = requests.post(f"{BASE_URL}/comments", headers=headers, json=comment_data)
    print("POST /comments Response:", response.status_code, response.text)

    if response.status_code == 201:
        created_comment = response.json()
        created_comment_id = created_comment.get("id")
        print("Created Comment ID:", created_comment_id)
    else:
        print("Failed to create comment:", response.status_code, response.text)

if __name__ == "__main__":
    main()
