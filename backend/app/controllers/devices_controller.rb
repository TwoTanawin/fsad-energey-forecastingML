class DevicesController < ApplicationController
  skip_before_action :authorize_request, only: [ :update_data, :create_data, :get_device_data ]
  before_action :validate_device_token, only: [ :update_data, :create_data, :get_device_data ]

  # Retrieve all data for a specific device
  def get_device_data
    device_data = Device.where(register_device_id: @register_device.id)

    if device_data.any?
      render json: {
        message: "Device data retrieved successfully",
        device_id: @register_device.id,
        data: device_data
      }, status: :ok
    else
      render json: { error: "No data found for this device" }, status: :not_found
    end
  end

  # Update data for a specific device
  def update_data
    device = Device.find_or_initialize_by(register_device_id: @register_device.id, user_id: @register_device.user_id)

    if device.update(device_params)
      render json: { message: "Data updated successfully" }, status: :ok
    else
      render json: { error: device.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Create new data for a device
  def create_data
    device = Device.new(device_params.merge(register_device_id: @register_device.id, user_id: @register_device.user_id))

    if device.save
      render json: { message: "Data created successfully", device: device }, status: :created
    else
      render json: { error: device.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Validate the device token and set @register_device
  def validate_device_token
    token = request.headers["Authorization"]&.split(" ")&.last
    Rails.logger.info("Raw Authorization header: #{request.headers['Authorization']}")
    Rails.logger.info("Extracted token: #{token}")

    @register_device = RegisterDevice.find_by(token: token)

    unless @register_device
      render json: { error: "Unauthorized device" }, status: :unauthorized
      nil
    end
  end

  # Strong parameters for device data
  def device_params
    params.require(:device).permit(:isActive, :voltage, :power, :current, :energy, :frequency, :PF, :electricPrice)
  end
end