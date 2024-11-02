class CreateLogins < ActiveRecord::Migration[7.2]
  def change
    create_table :logins do |t|
      t.string :email
      t.string :password
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
