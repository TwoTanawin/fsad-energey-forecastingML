from cryptography.fernet import Fernet
import json

# Generate a key for encryption and decryption
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# List to hold the encrypted and decrypted messages
data = []

# Encrypt the message
for i in range(10):
    message = f"Device@{i+1}"
    encrypted_text = cipher_suite.encrypt(message.encode())  # Converts message to bytes and encrypts

    # Decrypt the message
    decrypted_text = cipher_suite.decrypt(encrypted_text).decode()  # Decrypts to bytes, then decodes to string

    # Append the encrypted and decrypted text to the list
    data.append({
        "encrypted": encrypted_text.decode(),  # Store as string
        "decrypted": decrypted_text
    })

# Save the data to a JSON file
with open('/Users/two-mac/Documents/ait/fsad/project/energy_forecastingML/test/encrypt/json/encrypted_devices.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Data saved to 'encrypted_devices.json'")
