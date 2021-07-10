import React from 'react'
import PropTypes from 'prop-types'

class TodoItemList extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.props.switchCompletedTodoItems()
  }
  render() {
    return (
      <>
        <hr/>
        <div className="form-check form-switch" onClick={this.handleClick}>
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="switchCompletedItems"
          ></input>
          <label class="form-check-label" for="switchCompletedItems">
            {this.props.hideCompletedTodoItems
              ? `完了項目を非表示中`
              : `完了項目を表示中`}
          </label>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">状態</th>
                <th scope="col">項目</th>
                <th scope="col" className="text-right">
                  チェック
                </th>
              </tr>
            </thead>
            <tbody>{this.props.children}</tbody>
          </table>
        </div>
      </>
    )
  }
}
export default TodoItemList

TodoItemList.propTypes = {
  switchCompletedTodoItems: PropTypes.func.isRequired,
  hideCompletedTodoItems: PropTypes.bool.isRequired,
}