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

  def create
    # Check if the user already liked this post
    existing_like = Like.find_by(user_id: @current_user.id, post_id: like_params[:post_id])

    if existing_like
      render json: { error: "User already liked this post" }, status: :unprocessable_entity
      return
    end

    # Create a new like with isLiked set to true
    @like = Like.new(like_params)
    @like.user_id = @current_user.id
    @like.isLiked = true  # Ensure isLiked is set to true

    if @like.save
      render json: @like, status: :created, location: @like
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end


  # def like_status
  #   post = Post.find(params[:id])
  #   like_count = post.likes.count
  #   is_liked = post.likes.exists?(user_id: @current_user.id)

  #   render json: { isLiked: is_liked, likeCount: like_count }
  # end


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

    # Check if post is liked by current user and return like count
    def check
      post_id = params[:post_id]
      is_liked = Like.exists?(user_id: @current_user.id, post_id: post_id)
      like_count = Like.where(post_id: post_id).count
      render json: { isLiked: is_liked, likeCount: like_count }
    end

  # POST /likes/toggle
  # POST /likes/toggle
  def toggle
    # Find existing like
    existing_like = Like.find_by(user_id: @current_user.id, post_id: params[:post_id])

    if existing_like
      # If a like exists, destroy it (unlike)
      existing_like.destroy
      render json: { isLiked: false, likeCount: Like.where(post_id: params[:post_id]).count }, status: :ok
    else
      # If no like exists, create a new like (like)
      @like = Like.new(post_id: params[:post_id], user_id: @current_user.id, isLiked: true)

      if @like.save
        render json: { isLiked: true, likeCount: Like.where(post_id: params[:post_id]).count }, status: :created
      else
        render json: @like.errors, status: :unprocessable_entity
      end
    end
  end


    # Like a post
    def create
      existing_like = Like.find_by(user_id: @current_user.id, post_id: like_params[:post_id])

      if existing_like
        Rails.logger.info "User has already liked post #{like_params[:post_id]}"
        render json: { error: "User already liked this post" }, status: :unprocessable_entity
        return
      end

      # Log the parameters to ensure they are correct
      Rails.logger.info "Parameters received: #{like_params.inspect}"

      @like = Like.new(like_params)
      @like.user_id = @current_user.id

      if @like.save
        render json: @like, status: :created
      else
        # Log error details
        Rails.logger.error "Failed to save like: #{@like.errors.full_messages}"
        render json: @like.errors, status: :unprocessable_entity
      end
    end


    # Unlike a post
    def destroy
      @like = Like.find_by(user_id: @current_user.id, post_id: params[:id])

      if @like
        @like.destroy
        head :no_content
      else
        render json: { error: "Like not found" }, status: :not_found
      end
    end

    def like_status
      post = Post.find(params[:id])
      like_count = Like.where(post_id: post.id, isLiked: true).count # Count likes with `isLiked` as true
      user_like = Like.find_by(user_id: @current_user.id, post_id: post.id)

      render json: {
        isLiked: user_like.present? && user_like.isLiked,
        likeCount: like_count
      }
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
