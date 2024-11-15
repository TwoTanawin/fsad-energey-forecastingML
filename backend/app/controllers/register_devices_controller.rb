# app/controllers/register_devices_controller.rb
class RegisterDevicesController < ApplicationController
  # Endpoint for a device to register and request a token
  skip_before_action :authorize_request, only: [ :hello_world ]
  # before_action :authorize_request
  before_action :authenticate_device_by_token, only: [ :hello_world ]


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


  # Endpoint to verify the device token
  def authenticate_device
    token = params[:token]

    if RegisterDevice.valid_token?(token)
      render json: { message: "Device authorized" }, status: :ok
    else
      render json: { error: "Unauthorized device" }, status: :unauthorized
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
