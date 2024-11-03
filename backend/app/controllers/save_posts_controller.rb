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
    @save_post = SavePost.new(save_post_params)

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

  # DELETE /save_posts/:id
  def destroy
    @save_post.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_save_post
    @save_post = SavePost.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def save_post_params
    params.require(:save_post).permit(:savePostID, :post_id, :user_id)
  end
end
