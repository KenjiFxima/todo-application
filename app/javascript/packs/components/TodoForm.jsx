import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import _ from "lodash"
import setAxiosHeaders from "./AxiosHeaders"
class TodoForm extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      signedIn: this.props.signedIn,
      todoItemList: this.props.todoItemList,
      errorFlag: {title: true, deadline: true}
    }
    this.handleBlur = this.props.handleBlur.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.titleRef = React.createRef()
    this.deadlineRef = React.createRef()
  }

  async handleSubmit(e) {
    e.preventDefault()
    setAxiosHeaders()
    if(!this.errorFlag){
      if (this.state.signedIn){   
        axios
          .post('/api/v1/todo_items', {
            todo_item: {
              title: this.titleRef.current.value,
              deadline: this.deadlineRef.current.value,
              complete: false
            }
          })
          .then(response => {
            const todoItem = response.data
            this.props.clearErrors()
            this.props.createTodoItem(todoItem)
          })
          .catch(error => {
            this.props.handleErrors(error)
          })
      }
      else{ 
        const previousId = parseInt(localStorage.getItem('id'))
        let id
        if (!Number.isInteger(previousId)){
          id = 0
        }
        else{
          id = previousId+1
        }
        const todoItem = {
            id: id,
            title: this.titleRef.current.value,
            deadline: this.deadlineRef.current.value,
            complete: false
        }
        localStorage.setItem('id', id)
        await this.props.createTodoItem(todoItem)
      }
    }
    e.target.reset()
    const errorFlag = _.mapValues(this.state.errorFlag, function(){ return true })
    this.setState({ errorFlag })
  }
  
  render() {
    console.log("BOOLIAN!!: ")
    console.log(this.state.errorFlag.title || this.state.errorFlag.deadline)
    return (
      <form onSubmit={this.handleSubmit} className="my-3">
        <div className="row">
          <div className="form-group col-md-5">
            <input
              type="text"
              name="title"
              ref={this.titleRef}
              className="form-control"
              id="title"
              placeholder="新しいToDoを書き込んでください"
              onBlur = {this.handleBlur}
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
                  onBlur = {this.handleBlur}
                />
                </span>
          </div>
          <div className="form-group col-md-3">
              <button className= "btn btn-info btn-block" disabled={this.state.errorFlag.title || this.state.errorFlag.deadline}>
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
  signedIn: PropTypes.bool.isRequired,
  todoItemList: PropTypes.array.isRequired,
  createTodoItem: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}