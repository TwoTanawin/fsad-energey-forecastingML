import requests

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Test user data for registration
user_data = {
    "user": {
        "firstName": "Gogo",
        "lastName": "Satoru",
        "email": "gogo@Gogo.com",
        "password": "securepassword",
        "password_confirmation": "securepassword",
        "userImg": "base64_encoded_image_data"  # Replace with actual base64 image data if needed
    }
}

# Register user
try:
    register_response = requests.post(f"{BASE_URL}/register", json=user_data)
    register_response.raise_for_status()  # Raises an error for 4xx/5xx status codes
    print("Register Response:", register_response.status_code, register_response.json())
except requests.exceptions.RequestException as e:
    print("Error during registration:", e)
