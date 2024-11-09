class Device < ApplicationRecord
  belongs_to :register_device
  belongs_to :user

  has_one :ml_prediction
end
