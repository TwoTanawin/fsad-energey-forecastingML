# app/controllers/register_devices_controller.rb
class RegisterDevicesController < ApplicationController
  # Endpoint for a device to register and request a token
  before_action :authorize_request


  def create
    if @current_user  # Use @current_user instead of looking up by email and password
      device = @current_user.register_devices.create(address: params[:address])

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
end
