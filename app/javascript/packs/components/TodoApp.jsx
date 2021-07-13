import React from 'react'
import ReactDOM from 'react-dom'
import axios from "axios"

import TodoItemList from "./TodoItemList"
import TodoItem from "./TodoItem"
import TodoForm from "./TodoForm"
import Spinner from "./Spinner"
import ErrorMessage from "./ErrorMessage"
class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todoItemList: [],
      hideCompletedTodoItems: false,
      isLoading: true,
      errorMessage: null
    }
    this.getTodoItemList = this.getTodoItemList.bind(this)
    this.createTodoItem = this.createTodoItem.bind(this)
    this.switchCompletedTodoItems = this.switchCompletedTodoItems.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }
  componentDidMount() {
    this.getTodoItemList()
  }
  getTodoItemList() {
    axios
      .get("/api/v1/todo_items")
      .then(response => {
        this.clearErrors()
        this.setState({ isLoading: true })
        const todoItemList = response.data
        this.setState({ todoItemList })
        this.setState({ isLoading: false })
      })
      .catch(() => {
        this.setState({ isLoading: true })
        this.setState({
          errorMessage: {
            message: "Todoリストの読み込みに失敗しました。"
          }
        })
      })
  }
  createTodoItem(todoItem) {
    const todoItemList = [todoItem, ...this.state.todoItemList]
    this.setState({ todoItemList })
  }
  switchCompletedTodoItems() {
    console.log()
    this.setState({
      hideCompletedTodoItems: !this.state.hideCompletedTodoItems
    })
  }
  handleErrors(errorMessage) {
    this.setState({ errorMessage })
  }
  clearErrors() {
    this.setState({
      errorMessage: null
    })
  }
  render() {
    return (
      <>
        {this.state.errorMessage && (
          <ErrorMessage
            errorMessage={this.state.errorMessage}
          />
        )}
        {!this.state.isLoading && (
          <>
            <TodoForm 
              createTodoItem={this.createTodoItem}
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors} 
            />
            <TodoItemList
              switchCompletedTodoItems={this.switchCompletedTodoItems}
              hideCompletedTodoItems={this.state.hideCompletedTodoItems}
            >
              {this.state.todoItemList.map(todoItem => (
                <TodoItem 
                  key={todoItem.id} 
                  todoItem={todoItem} 
                  getTodoItemList={this.getTodoItemList} 
                  hideCompletedTodoItems={this.state.hideCompletedTodoItems}
                  handleErrors={this.handleErrors}
                  clearErrors={this.clearErrors}
                />
              ))}
            </TodoItemList>
          </>
        )}
        {this.state.isLoading && <Spinner />}
      </>
    )
  }
}
document.addEventListener('turbolinks:load', () => {
  const app = document.getElementById('todo-app')
  app && ReactDOM.render(<TodoApp />, app)
})