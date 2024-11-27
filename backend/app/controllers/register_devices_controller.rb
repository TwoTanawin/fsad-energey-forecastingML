class RegisterDevicesController < ApplicationController
  # Skip authorization only for non-authenticated actions
  skip_before_action :authorize_request, only: [ :hello_world, :device_info, :update ]
  before_action :authenticate_device_by_token, only: [ :hello_world, :device_info, :update  ]

  def create
    if @current_user
      # Create the device with a generated token
      device = @current_user.register_devices.create(
        address: params[:address],
        token: SecureRandom.hex(16) # Generates a custom token
      )

      if device.save
        render json: { token: device.token, message: "Device registered successfully" }, status: :created
      else
        render json: { error: "Device registration failed" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid user credentials" }, status: :unauthorized
    end
  end

  def update
    # Ensure @device is authenticated by token
    if @device.nil?
      Rails.logger.error("Unauthorized access: No device found for the token")
      render json: { error: "Unauthorized or invalid device" }, status: :unauthorized
      return
    end
  
    # Check that the ID in the route matches the authenticated device
    if @device.id != params[:id].to_i
      Rails.logger.error("Device ID mismatch: Route ID #{params[:id]}, Device ID #{@device.id}")
      render json: { error: "Device ID mismatch" }, status: :unauthorized
      return
    end
  
    # Extract the address parameter from the nested hash
    address = params.dig(:register_device, :address)
    if address.blank?
      Rails.logger.error("Address parameter is missing or empty")
      render json: { error: "Address parameter is missing or empty" }, status: :unprocessable_entity
      return
    end
  
    # Update the device address
    Rails.logger.info("Updating address for Device ID: #{@device.id}, New Address: #{address}")
    if @device.update(address: address)
      render json: { message: "Device address updated successfully", device: @device }, status: :ok
    else
      Rails.logger.error("Failed to update address for Device ID: #{@device.id}, Errors: #{@device.errors.full_messages}")
      render json: { error: "Failed to update device address", details: @device.errors.full_messages }, status: :unprocessable_entity
    end
  end  



  def device_info
    render json: {
      device_details: {
        id: @device.id,
        address: @device.address,
        created_at: @device.created_at
      }
    }, status: :ok
  end

  def list_user_devices
    # No need to decode token manually; `authorize_request` handles this
    if @current_user.nil?
      render json: { error: "Unauthorized access. User not authenticated." }, status: :unauthorized
      return
    end

    devices = @current_user.register_devices

    if devices.any?
      render json: { devices: devices }, status: :ok
    else
      render json: { error: "No devices found for this user" }, status: :not_found
    end
  end

  # Endpoint to verify the device token
  def authenticate_device
    token = params[:token]

    if RegisterDevice.valid_token?(token)
      render json: { message: "Device authorized" }, status: :ok
    else
      render json: { error: "Unauthorized device" }, status: :unauthorized
    end
  end

  def get_token_by_id
    register_device = RegisterDevice.find_by(id: params[:id])
    if register_device
      render json: { token: register_device.token }, status: :ok
    else
      render json: { error: "Register device not found" }, status: :not_found
    end
  end

  def hello_world
    render json: {
      message: "Hello World device",
      device_details: {
        id: @device.id,
        address: @device.address,
        created_at: @device.created_at
      }
    }, status: :ok
  end



  private

  def authenticate_device_by_token
    token = request.headers["Authorization"]&.split(" ")&.last
    Rails.logger.info("Extracted token: #{token}")

    @device = RegisterDevice.find_by(token: token)

    unless @device
      render json: { error: "Unauthorized device" }, status: :unauthorized
    end
  end
end
