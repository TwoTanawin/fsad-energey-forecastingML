import requests

# Replace with your application's base URL
BASE_URL = "http://localhost:3000"

# Function to log in the user
def user_login():
    print("Logging in user...")
    login_data = {
        "email": "jojo@jojo.com",  # Replace with a valid email
        "password": "securepassword"  # Replace with the correct password
    }
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    print("Login Response:", response.status_code, response.json())

    if response.status_code == 200:
        return response.json().get("token")
    else:
        print("User login failed. Cannot proceed.")
        return None

# Function to list all devices for the current user
def list_user_devices(auth_token):
    print("Fetching user's devices...")
    url = f"{BASE_URL}/register_devices/list_user_devices"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)
    print("Devices Response:", response.status_code, response.json())

    if response.status_code == 200:
        print("Devices retrieved successfully!")
        devices = response.json().get("devices", [])
        for device in devices:
            print(f"Device ID: {device['id']}, Address: {device['address']}, Created At: {device['created_at']}")
    elif response.status_code == 404:
        print("No devices found for this user.")
    else:
        print(f"Failed to retrieve devices. Status Code: {response.status_code}, Response: {response.text}")

if __name__ == "__main__":
    # Log in the user and retrieve the token
    auth_token = user_login()

    if auth_token:
        # Use the token to fetch the user's devices
        list_user_devices(auth_token)
    else:
        print("Cannot proceed without a valid authentication token.")
