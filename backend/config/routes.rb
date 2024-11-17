Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  post "/register", to: "authentication#register"
  post "/login", to: "authentication#login"

  get "/users", to: "authentication#index"
  get "/users/:id", to: "authentication#show"
  put "/users/:id", to: "authentication#update"
  patch "/users/:id", to: "authentication#update"
  delete "/users/:id", to: "authentication#destroy"

  resources :posts, only: [ :index, :show, :create, :update, :destroy ]


  # resources :comments, only: [ :index, :show, :create, :update, :destroy ]
  resources :likes, only: [ :index, :show, :create, :update, :destroy ]

  delete "/save_posts/post/:post_id", to: "save_posts#destroy_by_post_id", as: :destroy_save_post_by_post_id

  get "/save_posts/user", to: "save_posts#user_saved_posts", as: :user_saved_posts
  # Other resources and routes
  resources :save_posts, only: [ :index, :show, :create, :update ] do
    member do
      get "check"  # Adds GET /save_posts/:id/check for the `check` action
    end
  end

  get "/likes/check/:post_id", to: "likes#check", as: :check_like
  post "/likes/toggle", to: "likes#toggle"
  get "/posts/:id/like_status", to: "posts#like_status"
  # get "/posts/:id/like_status", to: "posts#like_status"

  resources :posts do
    resources :comments, only: [ :index, :create ]
  end
  resources :comments, only: [ :show, :update, :destroy ]

  resources :register_devices, only: [ :create ] do
    collection do
      post "authenticate", to: "register_devices#authenticate_device"
      get "hello_world", to: "register_devices#hello_world" # Route for hello_world action
      get "device_info", to: "register_devices#device_info" # Route for device_info action
      get "list_user_devices", to: "register_devices#list_user_devices"
    end
  end
  get "/register_devices/:id/token", to: "register_devices#get_token_by_id"

  post "/devices/update_data", to: "devices#update_data"
  post "/devices/data", to: "devices#create_data"
  get "/devices/:device_id/data", to: "devices#get_device_data"
end
