import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: User login to get the user token
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

# Test create_data endpoint
def test_create_data(device_token):
    print("Testing create_data endpoint...")
    headers = {"Authorization": f"Bearer {device_token}"}
    device_data = {
        "device": {
            "isActive": True,
            "voltage": 230.5,
            "power": 1500.0,
            "current": 6.8,
            "energy": 102.3,
            "frequency": 50.0,
            "PF": 0.96,
            "electricPrice": 0.15
        }
    }
    response = requests.post(f"{BASE_URL}/devices/data", json=device_data, headers=headers)
    print("Response Code:", response.status_code)
    print("Response JSON:", response.json())

# Test update_data endpoint
def test_update_data(device_token):
    print("Testing update_data endpoint...")
    headers = {"Authorization": f"Bearer {device_token}"}
    device_data = {
        "device": {
            "isActive": True,
            "voltage": 240.0,
            "power": 1700.0,
            "current": 7.2,
            "energy": 120.0,
            "frequency": 50.0,
            "PF": 0.98,
            "electricPrice": 0.18
        }
    }
    response = requests.post(f"{BASE_URL}/devices/update_data", json=device_data, headers=headers)
    print("Response Code:", response.status_code)
    print("Response JSON:", response.json())

# Main execution
if __name__ == "__main__":
    # Step 1: Login user
    user_token = user_login()

    # Step 2: Use device token if login is successful
    if user_token:
        # Replace this with the correct device token associated with the logged-in user
        device_token = "cffecc99549feaf78d04fa738f3c1a07"  # Replace with the device token
        test_create_data(device_token)
        test_update_data(device_token)
