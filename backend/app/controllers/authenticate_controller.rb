class AuthenticateController < ApplicationController
  before_action :authorize_request, except: [ :register, :login ] # Secure only applicable actions

  # POST /register
  def register
    @user = User.new(user_params)
    if @user.save
      token = encode_token({ user_id: @user.id })
      render json: { user: @user, token: token }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /login
  def login
    @user = User.find_by(email: params[:email])
    if @user&.authenticate(params[:password])
      token = encode_token({ user_id: @user.id })
      render json: { user: @user, token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def user_params
    params.require(:user).permit(:userId, :firstName, :lastName, :email, :password, :password_confirmation, :userImg)
  end

  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, ENV["JWT_SECRET_KEY"])
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
      Rails.logger.info("Successfully decoded token: #{decoded_token}")
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
