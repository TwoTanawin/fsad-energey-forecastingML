class CreateSavePosts < ActiveRecord::Migration[7.2]
  def change
    create_table :save_posts do |t|
      t.integer :savePostID
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
