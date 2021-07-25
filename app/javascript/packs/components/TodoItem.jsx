import React from 'react'
import PropTypes from 'prop-types'
import axios from "axios"
import setAxiosHeaders from "./AxiosHeaders"
import _ from "lodash"
import { Icon, InlineIcon } from '@iconify/react'
import okIcon from '@iconify-icons/cryptocurrency/ok'


class TodoItem extends React.Component {
  constructor(props) {
    super(props)
    console.log('TodoItem constructor' + JSON.stringify(this.props))
    this.state = {
      complete: this.props.todoItem.complete,
      signedIn: this.props.signedIn
    }
    this.inputRef = React.createRef()
    this.deadlineRef = React.createRef()
    this.completedRef = React.createRef()
    this.handleDestroy = this.handleDestroy.bind(this)
    this.path = `/api/v1/todo_items/${this.props.todoItem.id}`
    this.id = this.props.todoItem.id
    this.handleChange = this.handleChange.bind(this)
    this.updateTodoItem = this.updateTodoItem.bind(this)
  }
  handleChange() {
    this.setState({
      complete: this.completedRef.current.checked
    })
    this.updateTodoItem()
  }
  updateTodoItem = _.debounce(() => {
      this.setState({ complete: this.completedRef.current.checked })
      setAxiosHeaders()
      if (this.state.signedIn){
        axios
          .put(this.path, {
            todo_item: {
              title: this.inputRef.current.value,
              deadline: this.deadlineRef.current.value,
              complete: this.completedRef.current.checked
            }
          })
          .then(() => {
            this.props.clearErrors()
          })
          .catch(error => {
            this.props.handleErrors(error)
          })
        }
      else{
        if (this.inputRef.current.value.length == 0){
          alert("項目が入力されていません。")
        }
        else{
          console.log("CURRENT: ")
          console.log(this.id)
          const id = this.id
          const todoItem = {
            id: id,
            title: this.inputRef.current.value,
            deadline: this.deadlineRef.current.value,
            complete: this.completedRef.current.checked
          }
          let todoItemList = JSON.parse(localStorage.getItem("todoItemList"))
          console.log("todoItemList-local: ")
          console.log(todoItemList)
          console.log(todoItemList[id])
          todoItemList[id] = todoItem
          console.log(todoItemList)
          localStorage.setItem("todoItemList", JSON.stringify(todoItemList))
        }
      }
    }
  ,100)
  handleDestroy() {
    setAxiosHeaders()
    const confirmation = confirm("よろしいですか?")
    if (confirmation) {
      if(this.state.signedIn){
        axios
          .delete(this.path)
          .then(() => {
            this.props.getTodoItemList()
            this.props.clearErrors()
          })
          .catch(error => {
            this.props.handleErrors(error)
          })
        }
        else{
          let todoItemList = JSON.parse(localStorage.getItem("todoItemList"))
          console.log("before:")
          console.log(todoItemList)
          delete todoItemList[this.id]
          console.log("after:")
          console.log(todoItemList)
          localStorage.setItem("todoItemList", JSON.stringify(todoItemList))
          this.props.getTodoItemList()
        }
    }
  }
  render() {
    console.log('In <TodoItem> props rendering: ' + JSON.stringify(this.props))

    const { todoItem } = this.props
    const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/
    return (
      <tr
      className={`${ this.state.complete && this.props.hideCompletedTodoItems ? `d-none` : "" } ${this.state.complete ? "table-light" : "table-light"}`}
      >
        <td>
          <Icon className={`${this.state.complete ? "text-success" : "text-light"}`} icon={okIcon} style={{ fontSize: `36px` }} />
        </td>
        <td>
          <input
            type="text"
            defaultValue={todoItem.title}
            disabled={this.state.complete}
            onChange={this.handleChange}
            ref={this.inputRef}
            className="form-control"
            id={`todoItem_title-${todoItem.id}`}
          />
        </td>
        <td className="text-right">
          <input
            type="date"
            defaultValue = {todoItem.deadline.match(dateRegex)[0]}
            disabled={this.state.complete}
            onChange={this.handleChange}
            ref={this.deadlineRef}
            className="form-control"
            id={`todoItem_deadline-${todoItem.id}`}
          />
        </td>
        <td className="text-right">
          <div className="form-check form-check-inline">
            <input
              type="boolean"
              defaultChecked={this.state.complete}
              type="checkbox"
              onChange={this.handleChange}
              ref={this.completedRef}
              className="form-check-input"
              id={`complete-${todoItem.id}`}
            />
            <label
              className="form-check-label"
              htmlFor={`complete-${todoItem.id}`}
            >
              完了
            </label>
          </div>
          <button
           onClick={this.handleDestroy} 
           className="btn btn-outline-danger"
           >
             削除
             </button>  
        </td>
      </tr>
    )
  }
}

export default TodoItem

TodoItem.propTypes = {
  signedIn: PropTypes.bool.isRequired,
  todoItem: PropTypes.object.isRequired,
  todoItemList: PropTypes.array.isRequired,
  getTodoItemList: PropTypes.func.isRequired,
  hideCompletedTodoItems: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired
}