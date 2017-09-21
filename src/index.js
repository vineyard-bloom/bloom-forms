import Form from './form.jsx'
import formActions from './formActions.js'
import formReducer from './formReducer.js'

import Button from './inputs/button.jsx'
import Checkbox from './inputs/checkbox.jsx'
import CurrencyInput from './inputs/currency-input.jsx'
import Dropzone from './inputs/dropzone.jsx'
import FileInput from './inputs/file-input.jsx'
import RangeInput from './inputs/range-input.jsx'
import SelectInput from './inputs/select-input.jsx'
import TextInput from './inputs/text-input.jsx'
import ToggleSwitch from './inputs/toggle-switch.jsx'

import { validatorAggregator } from './validator.js';

export default = {
  Button,
  Checkbox,
  CurrencyInput,
  Dropzone,
  FileInput,
  Form,
  formActions,
  formReducer,
  RangeInput,
  SelectInput,
  TextInput,
  ToggleSwitch,
  validator: validatorAggregator
}
