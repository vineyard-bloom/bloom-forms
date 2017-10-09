import Form from './form.jsx'
import * as formActions from './formActions.js'
import formReducer from './formReducer.js'

import Button from './inputs/button.jsx'
import Checkbox from './inputs/checkbox.jsx'
import CurrencyInput from './inputs/currency-input.jsx'
import Dropzone from './inputs/dropzone.jsx'
import ErrorTip from './error-tip.jsx'
import FileInput from './inputs/file-input.jsx'
import RadioGroup from './inputs/radio-group.jsx'
import RangeInput from './inputs/range-input.jsx'
import SelectInput from './inputs/select-input.jsx'
import TextArea from './inputs/text-area.jsx'
import TextInput from './inputs/text-input.jsx'
import ToggleSwitch from './inputs/toggle-switch.jsx'

import { validatorAggregator as validator } from './validator.js';

export {
  Button,
  Checkbox,
  CurrencyInput,
  Dropzone,
  ErrorTip,
  FileInput,
  Form,
  formActions,
  formReducer,
  RadioGroup,
  RangeInput,
  SelectInput,
  TextArea,
  TextInput,
  ToggleSwitch,
  validator
}
