import React from 'react'
import { Route } from 'react-router-dom'

export default class VisibleRoute extends React.Component {
  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        children={({ match }) => (
          <div style={{display: match ? 'block' : 'none', height: '100%'}}>
            {this.props.component}
          </div>
        )} />
    )
  }
}