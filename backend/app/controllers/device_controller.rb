class DeviceController < ApplicationController
  before_action :set_device, only: [ :index, :show, :update, :destroy ]
  before_action :authorize_request

  # GET /devices
  def index
    if @current_user.nil?
      render json: { error: "Unauthorized access. No current user found." }, status: :unauthorized and return
    end

    @devices = @current_user.register_devices
    render json: @devices
  end


  # GET /devices/:id
  def show
    render json: @device
  end

  # POST /devices
  def create
    @device = current_user.devices.build(device_params)

    if @device.save
      render json: @device, status: :created
    else
      render json: { errors: @device.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /devices/:id
  def update
    if @device.update(device_params)
      render json: @device
    else
      render json: { errors: @device.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /devices/:id
  def destroy
    @device.destroy
    head :no_content
  end

  private

  def set_device
    Rails.logger.info("Current user in set_device: #{@current_user.inspect}")
    @device = current_user.devices.find_by(id: params[:id])
    render json: { error: "Device not found" }, status: :not_found unless @device
  end


  def device_params
    params.require(:device).permit(:deviceID, :isActive, :voltage, :power, :amp, :address, :electricPrice, :register_device_id)
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
      @current_user = User.find_by(id: decoded_token["user_id"])

      if @current_user.nil?
        Rails.logger.error("No user found with id: #{decoded_token['user_id']}")
        render json: { error: "User not found" }, status: :unauthorized and return
      end
    rescue JWT::ExpiredSignature
      render json: { error: "Token has expired" }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.error("JWT Decode Error: #{e.message}")
      render json: { error: "Invalid token: #{e.message}" }, status: :unauthorized
    end
  end


  # Define a helper to return the current user object for use in controllers
  def current_user
    @current_user
  end
end
