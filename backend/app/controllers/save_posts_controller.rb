class SavePostsController < ApplicationController
  before_action :authorize_request
  before_action :set_save_post, only: [ :show, :update, :destroy ]

  # GET /save_posts
  def index
    @save_posts = SavePost.all
    render json: @save_posts
  end

  # GET /save_posts/:id
  def show
    render json: @save_post
  end

  # POST /save_posts
  def create
    # Check if the post is already saved by the current user
    existing_save = SavePost.find_by(user_id: @current_user.id, post_id: save_post_params[:post_id])

    if existing_save
      render json: { error: "Post already saved" }, status: :unprocessable_entity
      return
    end

    # Create a new saved post
    @save_post = SavePost.new(save_post_params)
    @save_post.user_id = @current_user.id  # Set user_id to the current user

    if @save_post.save
      render json: @save_post, status: :created, location: @save_post
    else
      render json: @save_post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /save_posts/:id
  def update
    if @save_post.update(save_post_params)
      render json: @save_post
    else
      render json: @save_post.errors, status: :unprocessable_entity
    end
  end

  def destroy
    Rails.logger.info "Attempting to delete SavePost with user_id: #{@current_user.id}, post_id: #{params[:id]}"
    save_post = SavePost.find_by(user_id: @current_user.id, post_id: params[:id])

    if save_post
      save_post.destroy
      head :no_content
    else
      Rails.logger.info "SavePost not found for user_id: #{@current_user.id}, post_id: #{params[:id]}"
      render json: { error: "Save post not found" }, status: :not_found
    end
  end

    # DELETE /save_posts/post/:post_id
    def destroy_by_post_id
      save_post = SavePost.find_by(user_id: @current_user.id, post_id: params[:post_id])

      if save_post
        save_post.destroy
        head :no_content
      else
        render json: { error: "Save post not found" }, status: :not_found
      end
    end


  def check
    is_saved = SavePost.exists?(user_id: @current_user.id, post_id: params[:id])
    render json: { isSaved: is_saved }
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_save_post
    @save_post = SavePost.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Save post not found" }, status: :not_found
  end

  # Only allow a list of trusted parameters through.
  def save_post_params
    params.require(:save_post).permit(:post_id)
  end
end
