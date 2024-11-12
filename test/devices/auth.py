import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: Define login data
login_data = {
    "email": "jojo@jojo.com",
    "password": "securepassword"  # Use the correct password here
}

# Step 2: Perform login request to retrieve token
login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

# Step 3: Extract token and user ID if login was successful
if login_response.status_code == 200:
    token = login_response.json().get("token")
    user_id = login_response.json().get("user", {}).get("id")  # Extract user ID

    if token and user_id:
        print("JWT Token:", token)
        print("Current User ID (PK):", user_id)

        # Step 4: Use the token for a protected endpoint (Device Registration)

        headers = {
            "Authorization": f"Bearer {token}"
        }

        device_data = {
            "address": "Device MAC or unique ID"  # Replace with actual device ID
        }

        # Step 5: Send device registration request
        device_registration_response = requests.post(
            f"{BASE_URL}/register_devices",
            json=device_data,
            headers=headers
        )

        # Check and display the response from device registration
        print("Device Registration Response:", device_registration_response.status_code, device_registration_response.json())

    else:
        print("Login succeeded, but token or user ID was not found.")
else:
    print("Login failed. Unable to test protected endpoint.")
