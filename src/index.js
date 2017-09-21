import form from './form.jsx'
import formActions from './formActions.js'
import formReducer from './formReducer.js'
import { validatorAggregator } from './validator.js';

export default = {
  form,
  formActions,
  formReducer,
  validator: validatorAggregator
}