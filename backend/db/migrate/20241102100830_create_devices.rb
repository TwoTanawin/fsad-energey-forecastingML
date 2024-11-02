class CreateDevices < ActiveRecord::Migration[7.2]
  def change
    create_table :devices do |t|
      t.string :deviceID
      t.boolean :isActive
      t.float :voltage
      t.float :power
      t.float :amp
      t.string :address
      t.float :electricPrice
      t.references :register_device, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
