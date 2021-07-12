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
    this.state = {
      complete: this.props.todoItem.complete,
    }
    this.inputRef = React.createRef()
    this.deadlineRef = React.createRef()
    this.completedRef = React.createRef()
    this.handleDestroy = this.handleDestroy.bind(this)
    this.path = `/api/v1/todo_items/${this.props.todoItem.id}`
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
      console.log(this.deadlineRef.current.value)
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
  ,500)
  handleDestroy() {
    setAxiosHeaders()
    const confirmation = confirm("よろしいですか?")
    if (confirmation) {
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
  }
  render() {
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
  todoItem: PropTypes.object.isRequired,
  getTodoItemList: PropTypes.func.isRequired,
  hideCompletedTodoItems: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired
}