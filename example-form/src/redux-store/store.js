import thunkMiddleware from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import bloomApp from 'redux-store/reducers'

const store = createStore(
  bloomApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
)

export default store
