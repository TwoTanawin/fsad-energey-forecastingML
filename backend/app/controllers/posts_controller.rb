class PostsController < ApplicationController
  before_action :authorize_request
  before_action :set_post, only: [ :show, :update, :destroy ]

# posts_controller.rb
def index
  posts = Post.includes(:user).order(created_at: :desc)
  render json: posts.as_json(include: { user: { only: [ :firstName, :lastName, :userImg ] } })
end



  # GET /posts/:id
  def show
    render json: @post
  end

  # POST /posts
  def create
    @post = Post.new(post_params)
    @post.user_id = @current_user.id  # Set user_id from the authenticated user

    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/:id
  def update
    # Check if the current user is the owner of the post
    if @post.user_id == @current_user.id
      if @post.update(post_params)
        render json: @post
      else
        render json: @post.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  # DELETE /posts/:id
  def destroy
    # Check if the current user is the owner of the post
    if @post.user_id == @current_user.id
      @post.destroy
      head :no_content
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_post
    @post = Post.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(:image, :content)
  end
end