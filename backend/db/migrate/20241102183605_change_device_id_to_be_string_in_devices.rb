class ChangeDeviceIdToBeStringInDevices < ActiveRecord::Migration[7.2]
  def change
    change_column :devices, :deviceID, :string
  end
end
