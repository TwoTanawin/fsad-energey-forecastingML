import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Test user data
user_data = {
    "user": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "password": "newsecurepassword",
        "userImg": "new_base64_encoded_image_data"
    }
}

# Register user
register_response = requests.post(f"{BASE_URL}/register", json=user_data)
print("Register Response:", register_response.status_code, register_response.json())

# Test login
login_data = {
    "email": "jane.smith@example.com",
    "password": "newsecurepassword"
}

login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

# Extract token from login response
if login_response.status_code == 200:
    token = login_response.json().get("token")
    print("JWT Token:", token)

    # Test accessing a protected endpoint (e.g., GET /users)
    headers = {
        "Authorization": f"Bearer {token}"
    }

    protected_response = requests.get(f"{BASE_URL}/users", headers=headers)
    print("Protected Endpoint Response:", protected_response.status_code, protected_response.json())
else:
    print("Login failed. Unable to test protected endpoint.")