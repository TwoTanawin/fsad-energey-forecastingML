class RegisterDevice < ApplicationRecord
  belongs_to :user

  before_create :generate_token

  # Generates a token when the device is created
  def generate_token
    self.token = SecureRandom.hex(16) # 32-character random token
  end

  # Validates a token
  def self.valid_token?(token)
    find_by(token: token).present?
  end
end
