class DeviceAuthController < ApplicationController
  before_action :authorize_request, except: [ :index, :show, :login_device ]

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

  # POST /login_device
  def login_device
    encrypted_device_id = params[:encrypted_device_id]
    user_email = params[:email]

    # Validate that the user exists
    user = User.find_by(email: user_email)
    if user.nil?
      render json: { error: "User not found" }, status: :not_found and return
    end

    # Load the predefined device data
    device_data = load_device_data

    # Check if the encrypted device ID matches any in the predefined data
    matching_device = device_data.find { |device| device["encrypted"] == encrypted_device_id }

    if matching_device
      render json: { message: "Device login successful", device: matching_device }, status: :ok
    else
      render json: { error: "Device not recognized" }, status: :unauthorized
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

  def load_device_data
    YAML.load_file(Rails.root.join("config", "device_data.yml"))["devices"]
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

  def current_user
    @current_user
  end

  def decrypt(encrypted_text)
    # Replace with the actual decryption logic
    # This example assumes the use of a symmetric key decryption method
    cipher = OpenSSL::Cipher.new("aes-256-cbc")
    cipher.decrypt
    cipher.key = ENV["DEVICE_ENCRYPTION_KEY"]
    cipher.iv = ENV["DEVICE_ENCRYPTION_IV"]
    decrypted = cipher.update(Base64.decode64(encrypted_text)) + cipher.final
    decrypted
  rescue OpenSSL::Cipher::CipherError => e
    Rails.logger.error("Decryption error: #{e.message}")
    nil
  end
end
