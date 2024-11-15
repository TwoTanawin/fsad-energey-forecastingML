import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: User login to get the user token
login_data = {
    "email": "jojo@jojo.com",  # Replace with a valid email
    "password": "securepassword"  # Replace with the correct password
}

# Perform login request
login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

if login_response.status_code == 200:
    # Extract the user JWT token
    user_token = login_response.json().get("token")
    print("User JWT Token:", user_token)

    # Step 2: Use the device token to send data
    device_token = "cffecc99549feaf78d04fa738f3c1a07"  # Replace with a valid device token

    headers = {
        "Authorization": f"Bearer {device_token}"
    }

    # Data to send to the device
    device_data = {
        "device": {
            "isActive": True,
            "voltage": 220.5,
            "power": 1500.0,
            "current": 6.8,
            "energy": 102.3,
            "frequency": 50.0,
            "PF": 0.96,
            "electricPrice": 0.15
        }
    }

    # Send the POST request to update device data
    response = requests.post(f"{BASE_URL}/devices/data", json=device_data, headers=headers)
    print("Device Data Update Response:", response.status_code, response.json())
else:
    print("Login failed. Cannot proceed with device data update.")
