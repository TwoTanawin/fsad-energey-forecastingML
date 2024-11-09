class LikesController < ApplicationController
  before_action :authorize_request
  before_action :set_like, only: [ :show, :update, :destroy ]

  # GET /likes
  def index
    @likes = Like.all
    render json: @likes
  end

  # GET /likes/:id
  def show
    render json: @like
  end

  # POST /likes
  def create
    # Check if the user already liked this post
    existing_like = Like.find_by(user_id: @current_user.id, post_id: like_params[:post_id])

    if existing_like
      render json: { error: "User already liked this post" }, status: :unprocessable_entity
      return
    end

    # Create a new like
    @like = Like.new(like_params)
    @like.user_id = @current_user.id  # Set user_id to the current user

    if @like.save
      render json: @like, status: :created, location: @like
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /likes/:id
  def update
    if @like.update(like_params)
      render json: @like
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  # DELETE /likes/:id
  def destroy
    @like.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_like
    @like = Like.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Like not found" }, status: :not_found
  end

  # Only allow a list of trusted parameters through.
  def like_params
    params.require(:like).permit(:isLiked, :post_id)
  end
end
