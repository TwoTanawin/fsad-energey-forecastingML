import requests

# Replace with your application's base URL
BASE_URL = "http://localhost:3000"

# Function to log in the user
def user_login():
    print("Logging in user...")
    login_data = {
        "email": "jojo@jojo.com",  # Replace with a valid email
        "password": "1111111"  # Replace with the correct password
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
        print("Login Response:", response.status_code, response.json())
        return response.json().get("token")
    except requests.exceptions.RequestException as e:
        print(f"Error during login: {e}")
        return None

# Function to test the GET /devices/all API
def test_get_all_devices_data(token):
    print("Testing GET /devices/all...")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.get(f"{BASE_URL}/devices/all", headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)
        print("API Response:", response.status_code, response.json())
        print("All devices data retrieved successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error during API call to GET /devices/all: {e}")
        if response.status_code == 500:
            print("Internal Server Error: Check your backend logic.")
        else:
            print(f"Failed to retrieve devices data. Status: {response.status_code}, Error: {response.json()}")

# Main logic
if __name__ == "__main__":
    # Step 1: Log in the user and retrieve the token
    token = user_login()

    # Step 2: If login succeeds, test the new API
    if token:
        test_get_all_devices_data(token)
    else:
        print("Unable to test API due to login failure.")
