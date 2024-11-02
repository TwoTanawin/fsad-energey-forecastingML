import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Test login
login_data = {
    "email": "john.doe@example.com",
    "password": "securepassword"
}

login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

# Extract token from login response
if login_response.status_code == 200:
    token = login_response.json().get("token")
    print("JWT Token:", token)
else:
    print("Login failed. Unable to test protected endpoint.")