import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: User login to get JWT token
login_data = {
    "email": "john.doe@example.com",
    "password": "securepassword"  # Replace with the actual password for the user
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

        # Step 2: Test login_device API
        login_device_data = {
            "email": "john.doe@example.com",
            "encrypted_device_id": "gAAAAABnJmp8GLxAShdWeiBqYecHsginfsIOSOecd2jJbOL9HWRsdMEbdgleCHAUaWXGiYdWc5ZkduenpibVAS8z0BXqqZicmw=="
        }

        login_device_response = requests.post(f"{BASE_URL}/login_device", json=login_device_data, headers=headers)
        try:
            login_device_response_json = login_device_response.json()
        except ValueError:
            print("Login Device Response is not JSON")
            login_device_response_json = {}

        print("Login Device Response:", login_device_response.status_code, login_device_response_json)
    else:
        print("Token not found in the login response.")
else:
    print("Login failed. Unable to test protected endpoint.")
