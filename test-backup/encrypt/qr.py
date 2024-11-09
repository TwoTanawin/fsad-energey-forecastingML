import qrcode
from PIL import Image, ImageDraw, ImageFont

# Sample data (your JSON-like structure)
data = [
    {
        "encrypted": "gAAAAABnJmp8GLxAShdWeiBqYecHsginfsIOSOecd2jJbOL9HWRsdMEbdgleCHAUaWXGiYdWc5ZkduenpibVAS8z0BXqqZicmw==",
        "decrypted": "Device@1"
    },
    {
        "encrypted": "gAAAAABnJmp8cRIwcVlmWTWbQGnPWd1Q5lYj4oK6rv1nd27I6shqh0vmT18_TwZnMFoBgfdXm4AADTo-etjLWKrZ6L82xN0URg==",
        "decrypted": "Device@2"
    },
    {
        "encrypted": "gAAAAABnJmp8W57Tt7SXlpT7f2ycwgoay7w_z5SAR7W3p_Dl7cGHS8zw-BiwAgBEjD5Mkwco0TLZXnnRfKn-SIMau1qbkvg2hQ==",
        "decrypted": "Device@3"
    },
    {
        "encrypted": "gAAAAABnJmp8ccP8QP2yOtSAfpdIPn8-2ix5Bn_ALAdwj4Zbw91rPAZF98Qth3WHcSFWHJ0d75hCAChCkkzXKcuI7o7oFiQ1Cw==",
        "decrypted": "Device@4"
    },
    {
        "encrypted": "gAAAAABnJmp8M-cPZt4D5nJWY6oUTVrsuR3pNgQmFrynf3ZhGtYea8uBbiuYz3DmAHSsitd3LLhH4JZ-CvoC02B5T2tMIw-itw==",
        "decrypted": "Device@5"
    },
    {
        "encrypted": "gAAAAABnJmp8VN_Wsvp6w7A3uUQvz3pKq9etOZ9lM6dc2GL0-lpkmXSNqEEqHXWMd-Z8b6eRxLu58F8JiO0FI3ro4aG-WH9BXw==",
        "decrypted": "Device@6"
    },
    {
        "encrypted": "gAAAAABnJmp8IN_0cRR1EtHvJzgqSxan8MHSFTas59ZXu2UkJc_Zfu5o--_qqp-sRP-Mwo_IM5e3NWqss19sxzcQU9B2ZJTCdw==",
        "decrypted": "Device@7"
    },
    {
        "encrypted": "gAAAAABnJmp8jrTDJKk650EdIXcnptH5nPPCSOeQFE7dNdI1cjdJ7wNO6-AA8booychtaBuW_WJY_w4tHMzcSJCCOHaE3UkCJQ==",
        "decrypted": "Device@8"
    },
    {
        "encrypted": "gAAAAABnJmp8bswLACZSTimzHg-BaEUEqoogalWqDtQjTl_D3M7M5XbDbdOBD8F0nG_iquA2VljJ4IBXsViq0_mISfoIHfaWWA==",
        "decrypted": "Device@9"
    },
    {
        "encrypted": "gAAAAABnJmp8Jpjx-NmXkv8EEZ1FqCN2F6Cw9QiEad70xMUoYfpyZ46Pq3M4_cZCc3dXhDI7bXSWhTj7a24JIl2tZClXI_hIOQ==",
        "decrypted": "Device@10"
    }
]

# Generate a QR code for each encrypted item with the corresponding title
for item in data:
    title = item['decrypted']  # Use the decrypted title as the QR code title
    encrypted_data = item['encrypted']
    
    # Combine title and encrypted data
    qr_data = f"{title}\n{encrypted_data}"
    
    # Generate QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Create QR code image
    img = qr.make_image(fill='black', back_color='white')
    
    # Convert to a PIL image to draw text
    img = img.convert('RGB')
    draw = ImageDraw.Draw(img)

    # Set font size and type (adjust the path to the font if necessary)
    font_size = 20
    font = ImageFont.load_default()

    # Position for the text (bottom center)
    text_position = (img.size[0] // 2, img.size[1] - 30)  # X center, Y near bottom
    
    # Add text to the image
    draw.text(text_position, title, fill="black", anchor="mm", font=font)

    # Save the QR code image with the title as the filename
    img.save(f"/Users/two-mac/Documents/ait/fsad/project/energy_forecastingML/test/encrypt/images/{title}.png")  # Save the QR code image with the title as the filename

print("QR codes saved as images with titles.")
