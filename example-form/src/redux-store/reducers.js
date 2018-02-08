/* reducers */
import { combineReducers } from 'redux'
import { formReducer } from 'bloom-forms'

export default combineReducers({
  forms: formReducer
})
