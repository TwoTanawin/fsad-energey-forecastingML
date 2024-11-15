import requests

BASE_URL = "http://localhost:3000"
user_credentials = {
    "email": "jojo@jojo.com",  # Replace with a valid email
    "password": "securepassword"  # Replace with the correct password
}
device_token = "cffecc99549feaf78d04fa738f3c1a07"  # Replace with a valid device token

# Step 1: User login to get the user token
def user_login():
    print("Logging in user...")
    response = requests.post(f"{BASE_URL}/login", json=user_credentials)
    print("Login Response Code:", response.status_code)
    print("Login Response JSON:", response.json())

    if response.status_code == 200:
        return response.json().get("token")
    else:
        print("User login failed. Cannot proceed.")
        return None

# Step 2: Fetch the Device ID using the Device Token
def fetch_device_id():
    print("Fetching device ID...")
    headers = {"Authorization": f"Bearer {device_token}"}
    response = requests.get(f"{BASE_URL}/register_devices/device_info", headers=headers)
    print("Fetch Device ID Response Code:", response.status_code)
    print("Fetch Device ID Response JSON:", response.json())
    
    if response.status_code == 200:
        return response.json().get("device_details", {}).get("id")
    else:
        print("Failed to fetch device ID. Ensure the device token is valid.")
        return None

# Step 3: Test get_device_data endpoint
def test_get_device_data(device_id):
    print(f"Fetching data for device ID: {device_id}")
    headers = {"Authorization": f"Bearer {device_token}"}
    response = requests.get(f"{BASE_URL}/devices/{device_id}/data", headers=headers)
    print("Get Device Data Response Code:", response.status_code)
    print("Get Device Data Response JSON:", response.json())

# Main execution
if __name__ == "__main__":
    # Step 1: User login
    user_token = user_login()

    # Step 2: Fetch the device ID if user login was successful
    if user_token:
        device_id = fetch_device_id()

        # Step 3: Test the endpoint if device ID was successfully retrieved
        if device_id:
            test_get_device_data(device_id)
