import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from 'redux-store/store'
import ExampleForm from 'components'

class AppRoot extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ExampleForm />
      </Provider>
    )
  }
}

var docRoot = document.getElementById('root')

ReactDOM.render(<AppRoot />, docRoot)
