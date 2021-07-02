class Api::V1::TodoItemsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_todo_item, only: [:show, :edit, :update, :destroy]
    def index
        @todo_items = current_user.todo_items.all
    end
    def show
        handle_unauthorized
    end
    def create
    end
    def update
    end
    def destroy
    end
    private
        def set_todo_item
            @todo_item = TodoItem.find(params[:id])
        end
        def authorized?
            @todo_item.user_id == current_user.id
        end
        def handle_unauthorized
            unless authorized?
              respond_to do |format|
                format.json { render :unauthorized, status: 401 }
              end
            end
        end
end
