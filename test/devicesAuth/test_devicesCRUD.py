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

    # Prepare headers with the token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Get a current register device ID from the /device_auth endpoint
    register_device_response = requests.get(f"{BASE_URL}/device_auth", headers=headers)
    if register_device_response.status_code == 200 and register_device_response.json():
        register_device_id = register_device_response.json()[0].get("id")  # Use the first available ID
        print("Using Register Device ID:", register_device_id)
    else:
        print("Failed to retrieve register device ID. Status Code:", register_device_response.status_code)
        print("Response:", register_device_response.text)
        exit()



    # Test POST /devices (Create a device)
    create_device_data = {
        "device": {
            "isActive": True,
            "voltage": 220.5,
            "power": 150.0,
            "amp": 0.68,
            "address": "123 Device Street",
            "electricPrice": 0.15,
            "register_device_id": register_device_id
        }
    }

    create_response = requests.post(f"{BASE_URL}/devices", json=create_device_data, headers=headers)
    print("Create Device Response:", create_response.status_code, create_response.json())

    # Test GET /devices (Index action)
    index_response = requests.get(f"{BASE_URL}/devices", headers=headers)
    print("Index Devices Response:", index_response.status_code, index_response.json())

    # Test GET /devices/:id (Show action)
    # Replace with an actual device ID returned from create_response if needed
    device_id = create_response.json().get("id") or 1  # Replace with a valid ID
    show_response = requests.get(f"{BASE_URL}/devices/{device_id}", headers=headers)
    print("Show Device Response:", show_response.status_code, show_response.json())

else:
    print("Login failed. Unable to test protected endpoints.")