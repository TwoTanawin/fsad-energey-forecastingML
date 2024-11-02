class DeviceAuthController < ApplicationController
  before_action :authorize_request, except: [ :index, :show ] # Secure actions as needed

  # POST /register_device
  def register_device
    @register_device = RegisterDevice.new(register_device_params)
    @register_device.user = current_user

    if @register_device.save
      render json: { message: "Device registered successfully", device: @register_device }, status: :created
    else
      render json: { errors: @register_device.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /registered_devices
  def index
    @devices = current_user.register_devices
    render json: @devices
  end

  # GET /registered_devices/:id
  def show
    @device = current_user.register_devices.find_by(id: params[:id])

    if @device
      render json: @device
    else
      render json: { error: "Device not found" }, status: :not_found
    end
  end

  private

  def register_device_params
    params.require(:register_device).permit(:registerDeviceID, :address)
  end

  def authorize_request
    token = request.headers["Authorization"]&.split(" ")&.last
    Rails.logger.info("Raw Authorization header: #{request.headers['Authorization']}")
    Rails.logger.info("Extracted token: #{token}")

    if token.nil?
      render json: { error: "Token missing" }, status: :bad_request and return
    end

    begin
      decoded_token = JWT.decode(token, ENV["JWT_SECRET_KEY"], true, { algorithm: "HS256" })[0]
      Rails.logger.info("Successfully decoded token: #{decoded_token.inspect}")
      @current_user = User.find(decoded_token["user_id"])
    rescue JWT::ExpiredSignature
      render json: { error: "Token has expired" }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.error("JWT Decode Error: #{e.message}")
      render json: { error: "Invalid token: #{e.message}" }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error("User not found: #{e.message}")
      render json: { error: "User not found" }, status: :unauthorized
    end
  end


  # Define a helper to return the current user object for use in controllers
  def current_user
    @current_user
  end
end
