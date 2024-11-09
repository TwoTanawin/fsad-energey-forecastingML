import requests
import base64
import os

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

def main():
    # Login data
    login_data = {
        "email": "gogo@Gogo.com",
        "password": "securepassword"
    }

    # Perform login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        json_response = response.json()
        token = json_response.get("token")

        if token:
            print("Login successful.")
            print("JWT Token:", token)
            
            # Test GET /posts with image processing
            output_dir = "/Users/two-mac/Documents/ait/fsad/project/efML/test/community/images/get"
            test_get_posts_with_images(token, output_dir)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def test_get_posts_with_images(token, output_dir):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Get all posts
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    if response.status_code == 200:
        posts = response.json()
        print("GET /posts Response:", response.status_code)

        # Process each post with an image
        for post in posts:
            post_id = post.get("id")
            content = post.get("content")
            encoded_image = post.get("image")

            if encoded_image:
                # Decode the image
                try:
                    decoded_image_data = base64.b64decode(encoded_image)
                    image_filename = f"post_{post_id}.jpg"
                    image_path = os.path.join(output_dir, image_filename)

                    # Save the image
                    with open(image_path, "wb") as image_file:
                        image_file.write(decoded_image_data)

                    print(f"Saved image for post {post_id} at {image_path}")
                except Exception as e:
                    print(f"Failed to decode/save image for post {post_id}: {e}")
            else:
                print(f"Post {post_id} has no image.")
    else:
        print("Failed to fetch posts:", response.status_code, response.text)

if __name__ == "__main__":
    main()
