class Post < ApplicationRecord
  belongs_to :user
  has_many :comments
  has_many :likes
  has_many :save_posts
end
