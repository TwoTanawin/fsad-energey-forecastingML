import requests

# Base URL for your Rails API
BASE_URL = "http://localhost:3000"

# Device token
DEVICE_TOKEN = "86a4e145aac7533c8f297c5cd236f2d5"

# Device data to be sent
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

# Step 1: Authenticate Device
def device_login():
    url = f"{BASE_URL}/register_devices/authenticate_device"
    payload = {
        "token": DEVICE_TOKEN
    }
    try:
        response = requests.post(url, json=payload)
        print("Device Login Response:")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())

        if response.status_code == 200:
            print("Device authenticated successfully!")
            return True
        else:
            print("Device authentication failed.")
            return False
    except Exception as e:
        print("Error during device login:", e)
        return False

# Step 2: Post Device Data
def post_device_data():
    url = f"{BASE_URL}/register_devices"
    headers = {
        "Authorization": f"Bearer {DEVICE_TOKEN}",  # Include device token in headers
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=device_data, headers=headers)
        print("\nPOST Device Data Response:")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error during POST request:", e)

# Main function to orchestrate login and data posting
if __name__ == "__main__":
    print("Starting Device Login and Data Posting Process...")
    if device_login():
        post_device_data()
    else:
        print("Skipping POST data due to failed device authentication.")
