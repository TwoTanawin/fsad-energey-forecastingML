import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: User login to get JWT token
login_data = {
    "email": "gogo@Gogo.com",
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

        # Step 2: Test GET /devices
        devices_response = requests.get(f"{BASE_URL}/devices", headers=headers)
        try:
            devices_response_json = devices_response.json()
        except ValueError:
            print("Devices Response is not JSON")
            devices_response_json = {}

        print("Devices Response:", devices_response.status_code, devices_response_json)

        # Step 3: Test POST /devices (create a new device)
        new_device_data = {
            "device": {
                "deviceID": "gAAAAABnJmp8cRIwcVlmWTWbQGnPWd1Q5lYj4oK6rv1nd27I6shqh0vmT18_TwZnMFoBgfdXm4AADTo-etjLWKrZ6L82xN0URg==",
                "isActive": True,
                "voltage": 220.0,
                "power": 1500.0,
                "amp": 6.8,
                "address": "123 Device Street",
                "electricPrice": 0.15,
                "register_device_id": 2  # Replace with an actual register_device_id if needed
            }
        }

        create_device_response = requests.post(f"{BASE_URL}/devices", json=new_device_data, headers=headers)
        try:
            create_device_response_json = create_device_response.json()
        except ValueError:
            print("Create Device Response is not JSON")
            create_device_response_json = {}

        print("Create Device Response:", create_device_response.status_code, create_device_response_json)

        # Step 4: Test PUT /devices/:id
        # device_id = create_device_response_json.get("id", create_device_response_json.get("deviceID", 1))  # Fallback to known ID
        # update_device_data = {
        #     "device": {
        #         "isActive": False,
        #         "voltage": 230.0
        #     }
        # }
        # update_device_response = requests.put(f"{BASE_URL}/devices/{device_id}", json=update_device_data, headers=headers)
        # try:
        #     update_device_response_json = update_device_response.json()
        # except ValueError:
        #     print("Update Device Response is not JSON")
        #     update_device_response_json = {}

        # print("Update Device Response:", update_device_response.status_code, update_device_response_json)
    else:
        print("Token not found in the login response.")
else:
    print("Login failed. Unable to test protected endpoint.")