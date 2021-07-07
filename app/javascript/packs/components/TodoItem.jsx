import React from 'react'
import PropTypes from 'prop-types'
import axios from "axios"
import setAxiosHeaders from "./AxiosHeaders"
import _ from "lodash"
import { Icon, InlineIcon } from '@iconify/react'
import checkCircle from '@iconify-icons/feather/check-circle'

class TodoItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      complete: this.props.todoItem.complete,
    }
    this.handleDestroy = this.handleDestroy.bind(this)
    this.path = `/api/v1/todo_items/${this.props.todoItem.id}`
    this.handleChange = this.handleChange.bind(this)
    this.updateTodoItem = this.updateTodoItem.bind(this)
    this.inputRef = React.createRef()
    this.completedRef = React.createRef()
    this.myRef = React.createRef()
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
      axios
        .put(this.path, {
          todo_item: {
            title: this.inputRef.current.value,
            complete: this.completedRef.current.checked
          }
        })
        .then(response => {})
        .catch(error => {
          console.log(error)
        });
    }
  ,1000)
  handleDestroy() {
    setAxiosHeaders()
    const confirmation = confirm("よろしいですか?")
    if (confirmation) {
      axios
        .delete(this.path)
        .then(response => {
          this.props.getTodoItems()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  render() {
    const { todoItem } = this.props
    return (
      <tr
      className={`${ this.state.complete && this.props.hideCompletedTodoItems ? `d-none` : "" } ${this.state.complete ? "table-light" : ""}`}
      >
        <td>
          <Icon icon={checkCircle} size={32} />
        </td>
        <td>
          <input
            type="text"
            defaultValue={todoItem.title}
            disabled={this.state.complete}
            onChange={this.handleChange}
            ref={this.inputRef}
            className="form-control"
            id={`todoItem__title-${todoItem.id}`}
          />
        <td><div ref={this.myRef} /></td>
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
  getTodoItems: PropTypes.func.isRequired,
  hideCompletedTodoItems: PropTypes.bool.isRequired
}