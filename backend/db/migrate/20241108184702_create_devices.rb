class CreateDevices < ActiveRecord::Migration[7.2]
  def change
    create_table :devices do |t|
      t.boolean :isActive
      t.float :voltage
      t.float :power
      t.float :current
      t.float :energy
      t.float :frequency
      t.float :PF
      t.float :electricPrice
      t.references :register_device, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
