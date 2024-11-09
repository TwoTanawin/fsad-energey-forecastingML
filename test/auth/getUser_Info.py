import requests
import base64
import os
import uuid

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

# Login data
login_data = {
    "email": "gogo@Gogo.com",
    "password": "securepassword"
}

# Step 1: Login and obtain token and user ID
login_response = requests.post(f"{BASE_URL}/login", json=login_data)

if login_response.status_code == 200:
    # Extract token and user information from login response
    token = login_response.json().get("token")
    user = login_response.json().get("user")
    user_id = user.get("id") if user else None

    if not (token and user_id):
        print("Login successful, but token or user ID not found.")
    else:
        print("Login successful.")
        print("JWT Token:", token)
        print("Current User ID (PK):", user_id)

        # Step 2: Fetch current user data
        headers = {
            "Authorization": f"Bearer {token}"
        }
        user_response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers)

        if user_response.status_code == 200:
            user_data = user_response.json()
            username = user_data.get("firstName")
            email = user_data.get("email")
            user_img_base64 = user_data.get("userImg")  # Assuming it's a base64-encoded string

            print("Username:", username)
            print("Email:", email)

            # If userImg is base64, decode and save it with a unique filename
            if user_img_base64:
                try:
                    # Fix base64 padding if necessary
                    missing_padding = len(user_img_base64) % 4
                    if missing_padding:
                        user_img_base64 += '=' * (4 - missing_padding)

                    # Decode the base64 image data
                    image_data = base64.b64decode(user_img_base64)

                    # Generate a unique filename
                    unique_filename = f"{uuid.uuid4()}.png"  # Change extension if needed
                    image_path = os.path.join("/Users/two-mac/Documents/ait/fsad/project/efML/test/auth/images", unique_filename)

                    # Ensure directory exists
                    os.makedirs(os.path.dirname(image_path), exist_ok=True)

                    # Write image to the specified path
                    with open(image_path, "wb") as image_file:
                        image_file.write(image_data)

                    print("Image saved at:", image_path)
                except Exception as e:
                    print("Failed to save image:", e)
            else:
                print("No user image found.")
        else:
            print("Failed to fetch user data:", user_response.status_code, user_response.json())
else:
    print("Login failed:", login_response.status_code, login_response.json())
