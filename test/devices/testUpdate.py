import requests

BASE_URL = "http://localhost:3000"
device_token = "86a4e145aac7533c8f297c5cd236f2d5"  # Replace with a valid device token

# Step 1: Fetch the Device ID using the Device Token
def fetch_device_id():
    print("Fetching device ID...")
    headers = {"Authorization": f"Bearer {device_token}"}
    response = requests.get(f"{BASE_URL}/register_devices/device_info", headers=headers)
    print("Fetch Device ID Response Code:", response.status_code)
    print("Fetch Device ID Response JSON:", response.json())
    
    if response.status_code == 200:
        return response.json().get("device_details", {}).get("id")
    else:
        print("Failed to fetch device ID. Ensure the device token is valid.")
        return None

# Step 2: Update the device address
def update_device_address(device_token, device_id, new_address):
    print(f"Updating address for device ID: {device_id}")
    url = f"{BASE_URL}/register_devices/{device_id}/update_address"
    headers = {
        "Authorization": f"Bearer {device_token}",  # Use device token here
        "Content-Type": "application/json",
    }
    payload = {
        "address": new_address
    }
    response = requests.patch(url, json=payload, headers=headers)
    print("Update Device Address Response Code:", response.status_code)
    print("Update Device Address Response JSON:", response.json())

    if response.status_code == 200:
        print("Device address updated successfully!")
    else:
        print("Failed to update device address.")

# Main execution
if __name__ == "__main__":
    # Step 1: Fetch the device ID
    device_id = fetch_device_id()

    # Step 2: Update the device address if device ID was successfully retrieved
    if device_id:
        new_address = "444 Phayathai Road, Wang Mai, Pathum Wan, Bangkok 10330"
        update_device_address(device_token, device_id, new_address)
    else:
        print("Cannot update device address without a valid device ID.")
