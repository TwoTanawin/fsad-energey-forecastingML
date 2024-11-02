import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Test login
# login_data = {
#     "email": "john.doe@example.com",
#     "password": "securepassword"
# }

login_data = {
    "email": "gogo@Gogo.com",
    "password": "securepassword"
}

login_response = requests.post(f"{BASE_URL}/login", json=login_data)

try:
    login_response_json = login_response.json()
except ValueError:
    print("Login Response is not JSON")
    login_response_json = {}

print("Login Response:", login_response.status_code, login_response_json)

# Extract token from login response
if login_response.status_code == 200:
    token = login_response_json.get("token")
    if token:
        print("JWT Token:", token)

        # Prepare headers with the token
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Test register device API
        register_device_data = {
            "register_device": {
                "address": "123 Shubuya Japan"
            }
        }

        register_response = requests.post(f"{BASE_URL}/device_auth/register_device", json=register_device_data, headers=headers)
        print("Register Device Response:", register_response.status_code, register_response.json())
    else:
        print("Token not found in the login response.")
else:
    print("Login failed. Unable to test protected endpoint.")
