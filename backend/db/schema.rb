# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_08_184801) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "post_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "devices", force: :cascade do |t|
    t.boolean "isActive"
    t.float "voltage"
    t.float "power"
    t.float "current"
    t.float "energy"
    t.float "frequency"
    t.float "PF"
    t.float "electricPrice"
    t.bigint "register_device_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["register_device_id"], name: "index_devices_on_register_device_id"
    t.index ["user_id"], name: "index_devices_on_user_id"
  end

  create_table "likes", force: :cascade do |t|
    t.boolean "isLiked"
    t.bigint "post_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_likes_on_post_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "logins", force: :cascade do |t|
    t.string "email"
    t.string "password"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_logins_on_user_id"
  end

  create_table "ml_predictions", force: :cascade do |t|
    t.float "voltage"
    t.float "power"
    t.float "current"
    t.float "energy"
    t.float "frequency"
    t.float "PF"
    t.float "electricPrice"
    t.bigint "device_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["device_id"], name: "index_ml_predictions_on_device_id"
  end

  create_table "posts", force: :cascade do |t|
    t.text "image"
    t.text "content"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "register_devices", force: :cascade do |t|
    t.string "address"
    t.string "token"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_register_devices_on_user_id"
  end

  create_table "save_posts", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_save_posts_on_post_id"
    t.index ["user_id"], name: "index_save_posts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "firstName"
    t.string "lastName"
    t.string "email"
    t.string "password"
    t.text "userImg"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
  end

  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "devices", "register_devices"
  add_foreign_key "devices", "users"
  add_foreign_key "likes", "posts"
  add_foreign_key "likes", "users"
  add_foreign_key "logins", "users"
  add_foreign_key "ml_predictions", "devices"
  add_foreign_key "posts", "users"
  add_foreign_key "register_devices", "users"
  add_foreign_key "save_posts", "posts"
  add_foreign_key "save_posts", "users"
end
