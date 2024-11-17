import requests

BASE_URL = "http://localhost:3000"
device_token = "86a4e145aac7533c8f297c5cd236f2d5"

headers = {"Authorization": f"Bearer {device_token}"}
response = requests.get(f"{BASE_URL}/devices/1/data", headers=headers)

if response.status_code == 200:
    data = response.json()
    print("Device Data:", data["data"])
else:
    print("Failed to fetch data:", response.status_code, response.text)
