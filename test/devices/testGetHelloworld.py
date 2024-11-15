import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Step 1: User login to get the user token
login_data = {
    "email": "jojo@jojo.com",
    "password": "securepassword"  # Use the correct password here
}

# Perform the login request
login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

if login_response.status_code == 200:
    # Extract the JWT token from the login response
    user_token = login_response.json().get("token")
    print("User JWT Token:", user_token)

    # Step 2: Use the provided device token to access the hello_world endpoint
    device_token = "5019b0010735425d42dc9d6d20baa1fb"  # Provided device token

    # Headers including the device token
    headers = {
        "Authorization": f"Bearer {device_token}"
    }

    # Send a GET request to the hello_world endpoint
    response = requests.get(f"{BASE_URL}/register_devices/hello_world", headers=headers)

    # Print the response
    print("Hello World Response:", response.status_code, response.json())
else:
    print("Login failed. Cannot proceed to access hello_world.")
