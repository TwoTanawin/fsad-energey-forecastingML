class CommentsController < ApplicationController
  before_action :authorize_request
  before_action :set_comment, only: [ :show, :update, :destroy ]

  # GET /comments
  def index
    @comments = Comment.all
    render json: @comments
  end

  # GET /comments/:id
  def show
    render json: @comment
  end

  # POST /comments
  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = @current_user.id  # Set the user_id to the current logged-in user

    if @comment.save
      render json: @comment, status: :created, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/:id
  def update
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/:id
  def destroy
    @comment.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_comment
    @comment = Comment.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Comment not found" }, status: :not_found
  end

  # Only allow a list of trusted parameters through.
  def comment_params
    params.require(:comment).permit(:content, :post_id)
  end
end
