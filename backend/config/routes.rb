Rails.application.routes.draw do
  # Define only the routes needed for authentication
  resources :users, only: [ :index, :show, :update, :destroy ]
  post "/register", to: "authenticate#register"
  post "/login", to: "authenticate#login"

  # Standard CRUD actions for users (optional if needed)
  # resources :users, only: [ :index, :show, :update, :destroy ]

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Define the root path route (optional, update as needed)
  # root "posts#index"

  resources :device_auth, only: [ :index, :show ] do
    collection do
      post "register_device"
    end
  end

  resources :devices

  post "login_device", to: "device_auth#login_device"

  resources :posts, only: [ :index, :show, :create, :update, :destroy ]

  resources :save_posts, only: [ :index, :show, :create, :update, :destroy ]

  resources :likes, only: [ :index, :show, :create, :update, :destroy ]
end
