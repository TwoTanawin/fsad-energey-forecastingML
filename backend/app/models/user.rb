class User < ApplicationRecord
  has_secure_password

  has_many :register_devices
  has_many :devices
  has_many :posts
  has_many :comments
  has_many :likes
  has_many :save_posts

  validates :email, presence: true, uniqueness: true
end
