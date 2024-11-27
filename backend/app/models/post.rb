class Post < ApplicationRecord
  belongs_to :user
  # has_many :comments
  has_many :likes
  has_many :save_posts

  has_many :comments, dependent: :destroy

  validates :content, length: { maximum: 200 }
end
