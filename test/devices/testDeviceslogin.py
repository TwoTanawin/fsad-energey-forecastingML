import requests

# Base URL for the API
BASE_URL = "http://localhost:3000"

# Device token to test
DEVICE_TOKEN = "86a4e145aac7533c8f297c5cd236f2d5"

# Test 1: Authenticate Device
def test_authenticate_device():
    url = f"{BASE_URL}/register_devices/authenticate_device"
    payload = {
        "token": DEVICE_TOKEN
    }
    try:
        response = requests.post(url, json=payload)
        print("Authenticate Device Response:")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error during device authentication:", e)

# Test 2: Access Protected Endpoint (Hello World)
def test_hello_world():
    url = f"{BASE_URL}/register_devices/hello_world"
    headers = {
        "Authorization": f"Bearer {DEVICE_TOKEN}"
    }
    try:
        response = requests.get(url, headers=headers)
        print("\nHello World Response:")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error during hello world request:", e)

# Test 3: Fetch Device Info
def test_device_info():
    url = f"{BASE_URL}/register_devices/device_info"
    headers = {
        "Authorization": f"Bearer {DEVICE_TOKEN}"
    }
    try:
        response = requests.get(url, headers=headers)
        print("\nDevice Info Response:")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error during device info request:", e)

# Run the tests
if __name__ == "__main__":
    print("Testing Device Authentication and API Access...")
    test_authenticate_device()
    test_hello_world()
    test_device_info()
