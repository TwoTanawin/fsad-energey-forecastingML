Rails.application.routes.draw do
  # Define only the routes needed for authentication
  post "/register", to: "authenticate#register"
  post "/login", to: "authenticate#login"

  # Standard CRUD actions for users (optional if needed)
  resources :users, only: [ :index, :show, :update, :destroy ]

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Define the root path route (optional, update as needed)
  # root "posts#index"

  resources :device_auth, only: [ :index, :show ] do
    collection do
      post "register_device"
    end
  end

  resources :devices, controller: "device", only: [ :index, :show, :create, :update, :destroy ]

  post "login_device", to: "device_auth#login_device"
end
