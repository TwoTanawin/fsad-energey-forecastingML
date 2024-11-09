import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Login data
login_data = {
    "email": "gogo@Gogo.com",
    "password": "securepassword"
}

# Perform login request
login_response = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login Response:", login_response.status_code, login_response.json())

# Extract token and user ID from login response
if login_response.status_code == 200:
    token = login_response.json().get("token")
    user = login_response.json().get("user")  # Get the user object
    user_id = user.get("id") if user else None  # Extract the ID (PK)

    if token and user_id:
        print("JWT Token:", token)
        print("Current User ID (PK):", user_id)

        # Example headers for future requests with the token
        headers = {
            "Authorization": f"Bearer {token}"
        }
        print("Headers for protected requests:", headers)

    else:
        print("Login successful, but token or user ID not found.")
else:
    print("Login failed. Unable to test protected endpoint.")
