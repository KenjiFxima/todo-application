import React from 'react'
import ReactDOM from 'react-dom'
import axios from "axios"
import _ from "lodash"

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
      errorMessage: null,
      signedIn: false
    }
    this.getSignedIn = this.getSignedIn.bind(this)
    this.getTodoItemList = this.getTodoItemList.bind(this)
    this.createTodoItem = this.createTodoItem.bind(this)
    this.switchCompletedTodoItems = this.switchCompletedTodoItems.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }
  componentDidMount() {
    this.getTodoItemList()
  }
  getSignedIn(){
    const p = new Promise(resolve => {axios
      .get("api/v1/todo_items/signed_in")
      .then(response => {
        this.clearErrors()
        this.setState({ isLoading: true })
        const signedIn = response.data['signed_in']
        this.setState({ signedIn })
        this.setState({ isLoading: false })
        resolve()
      })
      .catch((error) => {
        this.setState({ isLoading: true })
        this.setState({
          errorMessage: {
            message: "読み込みに失敗しました。"
          }
        })
      })
    })
    return p
  }
async getTodoItemList() {
    await this.getSignedIn()
    if (this.state.signedIn){
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
  else{
    const todoItemList = _.values(JSON.parse(localStorage.getItem('todoItemList')))
    if (!Array.isArray(todoItemList)){
      await this.setState({ todoItemList: [] })
    }
    else{
      await this.setState({ todoItemList })
    }
  }
}
  createTodoItem(todoItem) {
    const todoItemList = [todoItem, ...this.state.todoItemList]
    const ids = todoItemList.map(e => {return e.id})
    const localTodoItemList = _.zipObject(ids, todoItemList)
    localStorage.setItem('todoItemList',  JSON.stringify(localTodoItemList))
    this.getTodoItemList()
  }
  switchCompletedTodoItems() {
    this.setState({
      hideCompletedTodoItems: !this.state.hideCompletedTodoItems
    })
  }
  handleBlur(e){
    const name = e.target.value
    const id = e.target.id
    let errorFlag = this.state.errorFlag
    if (!name){
      errorFlag[id] = true
      this.setState({ errorFlag })
    }
    else{
      errorFlag[id] = false
      this.setState({ errorFlag })
    }   
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
              signedIn={this.state.signedIn}
              todoItemList={this.state.todoItemList}
              createTodoItem={this.createTodoItem}
              handleBlur={this.handleBlur}
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors}
            />
            <TodoItemList
              switchCompletedTodoItems={this.switchCompletedTodoItems}
              hideCompletedTodoItems={this.state.hideCompletedTodoItems}
            >
              {this.state.todoItemList.map(todoItem => (
                <TodoItem
                  todoItemList={this.state.todoItemList}
                  signedIn={this.state.signedIn}
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