class CreateMlPredictions < ActiveRecord::Migration[7.2]
  def change
    create_table :ml_predictions do |t|
      t.integer :mlID
      t.float :voltage
      t.float :power
      t.float :amp
      t.string :address
      t.float :electricPrice
      t.references :device, null: false, foreign_key: true

      t.timestamps
    end
  end
end
