import React from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
class TodoForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.titleRef = React.createRef()
  }

  handleSubmit(e) {
    e.preventDefault()
    axios
      .post('/api/v1/todo_items', {
        todo_item: {
          title: this.titleRef.current.value,
          complete: false,
        },
      })
      .then(response => {
        const todoItem = response.data
        this.props.createTodoItem(todoItem)
      })
      .catch(error => {
        console.log(error)
      })
    e.target.reset()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="my-3">
        <div className="row">
          <div className="form-group col-md-6">
            <input
              type="text"
              name="title"
              ref={this.titleRef}
              required
              className="form-control"
              id="title"
              placeholder="ToDoを書き込んでください"
            />
          </div>
          <div className="form-group col-lg-2">
              <button className="btn btn-outline-success btn-block">
                ToDoを追加
              </button>
          </div>
        </div>
      </form>
    )
  }
}

export default TodoForm

TodoForm.propTypes = {
  createTodoItem: PropTypes.func.isRequired,
}