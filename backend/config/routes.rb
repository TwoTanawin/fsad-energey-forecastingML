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
  resources :comments, only: [ :index, :show, :create, :update, :destroy ]
  resources :likes, only: [ :index, :show, :create, :update, :destroy ]
  resources :save_posts, only: [ :index, :show, :create, :update, :destroy ]
end
