import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import setAxiosHeaders from "./AxiosHeaders"
class TodoForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.titleRef = React.createRef()
    this.deadlineRef = React.createRef()
  }

  handleSubmit(e) {
    e.preventDefault()
    setAxiosHeaders()
    axios
      .post('/api/v1/todo_items', {
        todo_item: {
          title: this.titleRef.current.value,
          deadline: this.deadlineRef.current.value,
          complete: false
        },
      })
      .then(response => {
        const todoItem = response.data
        this.props.clearErrors()
        this.props.createTodoItem(todoItem)
      })
      .catch(error => {
        this.props.handleErrors(error)
      })
    e.target.reset()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="my-3">
        <div className="row">
          <div className="form-group col-md-5">
            <input
              type="text"
              name="title"
              ref={this.titleRef}
              // required
              className="form-control"
              id="title"
              placeholder="新しいToDoを書き込んでください"
            />
          </div>
          <div className="form-group col-md-4">
                <label className="form" htmlFor="deadline"><h6>締め切り:</h6></label>
                <span>
                <input 
                  type="date"
                  name="deadline"
                  ref={this.deadlineRef}
                  className="form-control"
                  id="deadline"
                  date-provide="datepicker"
                />
                </span>
          </div>
          <div className="form-group col-md-3">
              <button className="btn btn-info btn-block">
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
  handleErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}