import requests
import base64

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

        # Get current user info
        headers = {
            "Authorization": f"Bearer {token}"
        }
        user_info_response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers)
        print("User Info Response:", user_info_response.status_code, user_info_response.json())

        # Read and encode the image in Base64
        profile_picture_path = "/Users/two-mac/Documents/ait/fsad/project/energy_forecastingML/test/user/user1.jpg"
        with open(profile_picture_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

        # Update user profile picture with Base64 encoded image
        update_data = {
            "user": {
                "userImg": encoded_image
            }
        }
        update_response = requests.put(f"{BASE_URL}/users/{user_id}", headers=headers, json=update_data)
        print("Update Profile Picture Response:", update_response.status_code, update_response.json())
    else:
        print("Login successful, but token or user ID not found.")
else:
    print("Login failed. Unable to test protected endpoint.")
