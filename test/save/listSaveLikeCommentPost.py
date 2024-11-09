import requests
import base64

BASE_URL = "http://localhost:3000"  # Replace with your actual base URL

def main():
    # Login data
    login_data = {
        "email": "gogo@Gogo.com",  # Replace with the actual email
        "password": "securepassword"  # Replace with the actual password
    }

    # Perform login request
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if response.status_code == 200:
        json_response = response.json()
        token = json_response.get("token")

        if token:
            print("Login successful.")
            print("JWT Token:", token)
            
            # Retrieve post details, saved status, likes, and comments for post_id 5
            post_id = 5
            list_saved_post_details(token, post_id)
        else:
            print("Login successful, but token not found.")
    else:
        print("Login failed:", response.status_code, response.text)

def list_saved_post_details(token, post_id):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Check if the post is saved by the current user
    saved_posts_response = requests.get(f"{BASE_URL}/save_posts", headers=headers)
    if saved_posts_response.status_code == 200:
        saved_posts = saved_posts_response.json()
        is_saved = any(saved_post["post_id"] == post_id for saved_post in saved_posts)
        print(f"Post {post_id} saved status: {'Saved' if is_saved else 'Not Saved'}")
    else:
        print("Failed to fetch saved posts:", saved_posts_response.status_code, saved_posts_response.text)

    # Fetch post details
    post_response = requests.get(f"{BASE_URL}/posts/{post_id}", headers=headers)
    if post_response.status_code == 200:
        post = post_response.json()
        content = post.get("content", "No content available")
        encoded_image = post.get("image")

        print(f"\nPost ID: {post_id}")
        print(f"Content: {content}")

        # Check if the post has an image
        if encoded_image:
            try:
                base64.b64decode(encoded_image)  # Check if image is valid
                print("Image: Available")
            except Exception as e:
                print(f"Image: N/A (error decoding image: {e})")
        else:
            print("Image: N/A")

    else:
        print(f"Failed to fetch post {post_id} details:", post_response.status_code, post_response.text)
        return

    # Fetch comments for the post
    comments_response = requests.get(f"{BASE_URL}/comments?post_id={post_id}", headers=headers)
    if comments_response.status_code == 200:
        comments = comments_response.json()
        print(f"\nComments for Post ID {post_id}:")

        # List each comment's content
        if comments:
            for comment in comments:
                comment_id = comment.get("id")
                content = comment.get("content", "No content")
                print(f"Comment ID: {comment_id}, Content: {content}")
        else:
            print("No comments found for this post.")
    else:
        print(f"Failed to fetch comments for post {post_id}:", comments_response.status_code, comments_response.text)

    # Fetch likes for the post and count them
    likes_response = requests.get(f"{BASE_URL}/likes?post_id={post_id}", headers=headers)
    if likes_response.status_code == 200:
        likes = likes_response.json()
        like_count = len(likes)
        print(f"\nLikes for Post ID {post_id}: {like_count}")

        # List each like's details
        if likes:
            for like in likes:
                like_id = like.get("id")
                is_liked = like.get("isLiked", False)
                user_id = like.get("user_id")
                print(f"Like ID: {like_id}, isLiked: {is_liked}, User ID: {user_id}")
        else:
            print("No likes found for this post.")
    else:
        print(f"Failed to fetch likes for post {post_id}:", likes_response.status_code, likes_response.text)

if __name__ == "__main__":
    main()
