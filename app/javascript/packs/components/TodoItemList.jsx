import React from 'react'
import PropTypes from 'prop-types'

class TodoItemList extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.props.toggleCompletedTodoItems()
  }
  render() {
    return (
      <>
        <hr/>
        <button
          className={`btn ${this.props.hideCompletedTodoItems ? `btn` : `btn-outline`}-secondary`}
          onClick={this.handleClick}
        >
          {this.props.hideCompletedTodoItems
            ? `完了項目を表示`
            : `完了項目を非表示`}
        </button>
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
  toggleCompletedTodoItems: PropTypes.func.isRequired,
  hideCompletedTodoItems: PropTypes.bool.isRequired,
}