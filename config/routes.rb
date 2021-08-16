Rails.application.routes.draw do
  devise_for :users
  unauthenticated do
    root "pages#home"
  end
  authenticated :user do
    root "pages#my_todo_items", as: :authenticated_root
  end
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :todo_items, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get 'signed_in', format: :json
        end
      end
    end
  end
end
