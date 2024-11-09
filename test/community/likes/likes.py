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
            
            # Test POST /likes for post_id 5
            post_id = 1
            test_like_post(token, post_id)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def test_like_post(token, post_id):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Like data
    like_data = {
        "like": {
            "isLiked": True,
            "post_id": post_id
        }
    }

    # Send the POST request to create a like
    response = requests.post(f"{BASE_URL}/likes", headers=headers, json=like_data)
    print("POST /likes Response:", response.status_code, response.text)

    if response.status_code == 201:
        created_like = response.json()
        created_like_id = created_like.get("id")
        print("Created Like ID:", created_like_id)
    elif response.status_code == 422:
        print("Already liked this post or invalid data:", response.status_code, response.json())
    else:
        print("Failed to create like:", response.status_code, response.text)

if __name__ == "__main__":
    main()
