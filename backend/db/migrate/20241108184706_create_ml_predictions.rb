class CreateMlPredictions < ActiveRecord::Migration[7.2]
  def change
    create_table :ml_predictions do |t|
      t.float :voltage
      t.float :power
      t.float :current
      t.float :energy
      t.float :frequency
      t.float :PF
      t.float :electricPrice
      t.references :device, null: false, foreign_key: true

      t.timestamps
    end
  end
end
