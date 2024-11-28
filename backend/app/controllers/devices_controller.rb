class DevicesController < ApplicationController
  skip_before_action :authorize_request, only: [ :update_data, :create_data, :get_device_data, :get_all_devices_data ]
  before_action :validate_device_token, only: [ :update_data, :create_data, :get_device_data ]

  # Retrieve all data for a specific device
  def get_device_data
    thread = Thread.new do
      Device.where(register_device_id: @register_device.id)
    end

    device_data = thread.value # Wait for the thread to complete and get the result

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

  def get_all_devices_data
    all_devices_thread = Thread.new do
      Device.includes(:register_device).all
    end

    all_devices_data = all_devices_thread.value

    if all_devices_data.any?
      threads = []

      formatted_data = all_devices_data.map do |device|
        threads << Thread.new do
          {
            id: device.id,
            isActive: device.isActive,
            avg_voltage: Device.where(id: device.id).average(:voltage)&.to_f&.round(3),
            avg_power: Device.where(id: device.id).average(:power)&.to_f&.round(3),
            avg_current: Device.where(id: device.id).average(:current)&.to_f&.round(3),
            avg_energy: Device.where(id: device.id).average(:energy)&.to_f&.round(3),
            avg_frequency: Device.where(id: device.id).average(:frequency)&.to_f&.round(3),
            avg_power_factor: Device.where(id: device.id).average(:PF)&.to_f&.round(3),
            avg_electric_price: Device.where(id: device.id).average(:electricPrice)&.to_f&.round(3),
            register_device_details: {
              id: device.register_device&.id,
              address: device.register_device&.address,
              created_at: device.register_device&.created_at
            }
          }
        end
      end

      formatted_data = threads.map(&:value)

      render json: {
        message: "All devices average data retrieved successfully",
        devices: formatted_data
      }, status: :ok
    else
      render json: { error: "No devices found" }, status: :not_found
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

  # # Create new data for a device
  # def create_data
  #   device = Device.new(device_params.merge(register_device_id: @register_device.id, user_id: @register_device.user_id))

  #   if device.save
  #     render json: { message: "Data created successfully", device: device }, status: :created
  #   else
  #     render json: { error: device.errors.full_messages }, status: :unprocessable_entity
  #   end
  # end

  def create_data
    thread = Thread.new do
      begin
        Device.create(device_params.merge(register_device_id: @register_device.id, user_id: @register_device.user_id))
      rescue => e
        Rails.logger.error("Error creating device data: #{e.message}")
        nil
      end
    end

    device = thread.value # Wait for the thread to finish and get the result

    if device&.persisted?
      render json: { message: "Data created successfully", device: device }, status: :created
    else
      error_message = device&.errors&.full_messages || [ "Failed to create device data" ]
      render json: { error: error_message }, status: :unprocessable_entity
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
