class CreateRegisterDevices < ActiveRecord::Migration[7.2]
  def change
    create_table :register_devices do |t|
      t.integer :registerDeviceID
      t.string :address
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
