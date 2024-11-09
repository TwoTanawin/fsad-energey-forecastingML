class CreateRegisterDevices < ActiveRecord::Migration[7.2]
  def change
    create_table :register_devices do |t|
      t.string :address
      t.string :token
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
