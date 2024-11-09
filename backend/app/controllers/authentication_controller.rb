class AuthenticationController < ApplicationController
  before_action :authorize_request, except: [ :register, :login ]
  before_action :set_user, only: [ :show, :update, :destroy ]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/:id
  def show
    render json: @user
  end

  # PATCH/PUT /users/:id
  def update
    if params[:user][:userImg].present?
      @user.userImg.attach(params[:user][:userImg])
    end

    if @user.update(user_params.except(:userImg))
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /users/:id
  def destroy
    @user.destroy
    render json: { message: "User deleted successfully" }, status: :ok
  end

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
    @user = User.find_by(id: params[:id])
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def user_params
    params.require(:user).permit(:firstName, :lastName, :email, :password, :password_confirmation, :userImg)
  end

  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, ENV["JWT_SECRET_KEY"])
  end
end
