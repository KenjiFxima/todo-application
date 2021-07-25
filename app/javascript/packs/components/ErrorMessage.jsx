import React from 'react'
import PropTypes from "prop-types"
import _ from "lodash"

class ErrorMessage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: _.get(props.errorMessage, "response.data", null),
      message: _.get(props.errorMessage, "message", null)
    }
  }
  render(){
    if (this.state.data) {
      const keys = Object.keys(this.state.data)
      return keys.map(key => {
        return (
          <div key={new Date()} className="alert alert-danger" role="alert">
            <p>{key}{this.state.data[key].map(message => message)}</p>
          </div>
        )}
      )}
    else if (this.state.message) {
      return (
        <div className="alert alert-danger" role="alert">
          <p className="mb-0">{this.state.message}</p>
        </div>
      )
    }
    else {
      return (
          <div className="alert alert-danger" role="alert">
          <p className="mb-0">エラーが発生しました。</p>
          </div>
      )
    }
  }
}

export default ErrorMessage

ErrorMessage.propTypes = {
  errorMessage: PropTypes.object.isRequired
}