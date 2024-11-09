class PostsController < ApplicationController
  before_action :authorize_request
  before_action :set_post, only: [ :show, :update, :destroy ]

  # GET /posts
  def index
    @posts = Post.all
    render json: @posts
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
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/:id
  def destroy
    @post.destroy
    head :no_content
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
