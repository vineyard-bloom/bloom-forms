import { describe, it } from 'mocha'
import React from 'react'
import * as assert from 'assert'
import Enzyme from 'enzyme'
import testConfigure from './helpers/configure-test'

testConfigure()

import Button from '../src/inputs/button.jsx'
import Checkbox from '../src/inputs/checkbox.jsx'
import CurrencyInput from '../src/inputs/currency-input.jsx'
import DateInput from '../src/inputs/date-input.jsx'
import Dropzone from '../src/inputs/dropzone.jsx'
import FileInput from '../src/inputs/file-input.jsx'
import RadioGroup from '../src/inputs/radio-group.jsx'
import RadioButtonGroup from '../src/inputs/radio-button-group.jsx'
import TextArea from '../src/inputs/text-area.jsx'
import TextInput from '../src/inputs/text-input.jsx'
import ToggleSwitch from '../src/inputs/toggle-switch.jsx'

const exampleFormData = {
  'checkbox': { value: '' },
  'currency-input': { value: '' },
  'date-input': { value: '' },
  'dropzone': { value: '' },
  'file-input': { value: '' },
  'radio': { value: '' },
  'radio-button': { value: '' },
  'select': { value: '' },
  'textarea': { value: '' },
  'textinput': { value: '' },
  'toggle-switch': { value: '' }
}

function exampleClick() {
  return
}

describe('<Button />', () => {
  it ('renders without breaking', () => {
    const exampleText = 'example button'
    const button = Enzyme.mount(<Button contents={ exampleText } onClick={ exampleClick } id='button-id' />)

    assert.ok((button).text().indexOf(exampleText) >= 0)
  })
})

describe('<Checkbox />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Checkbox'
    const checkbox = Enzyme.mount(
      <Checkbox name='checkbox' label={ exampleLabel } checked onChange={() => ''} formData={ exampleFormData } />
    )

    assert.ok((checkbox).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<CurrencyInput />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Currency Input'
    const currency = Enzyme.mount(
      <CurrencyInput label={ exampleLabel } name='currency-input' id='currency-input' maximumValue={ 100 } value='50' formData={ exampleFormData } />
    )

    assert.ok((currency).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<DateInput />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Date Input'
    const date = Enzyme.mount(
      <DateInput label={ exampleLabel } name='date-input' value='2017/12/12' onChange={ exampleClick } formData={ exampleFormData } />
    )

    assert.ok((date).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<Dropzone />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Dropzone'
    const dropzone = Enzyme.mount(
      <Dropzone label={ exampleLabel } name='dropzone' onChange={ exampleClick } formData={ exampleFormData } />
    )

    assert.ok((dropzone).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<FileInput />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example File Input'
    const file = Enzyme.mount(
      <FileInput label={ exampleLabel } name='file-input' formId='example-form' onChange={ exampleClick } id='example-form' formData={ exampleFormData } />
    )

    assert.ok((file).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<RadioGroup />', () => {
  it ('renders without breaking', () => {
    const options = [
      {
        label: 'Option 1',
        id: 'opt-1'
      },
      {
        label: 'Option 2',
        id: 'opt-2'
      }
    ]
    const radio = Enzyme.mount(
      <RadioGroup options={ options } value='opt-2' onChange={ exampleClick } name='radio' label='radio' formData={ exampleFormData } />
    )

    assert.ok((radio).text().indexOf('Option 2') >= 0)
  })
})

describe('<RadioButtonGroup />', () => {
  it ('renders without breaking', () => {
    const options = [
      {
        label: 'Option 1',
        id: 'opt-1'
      },
      {
        label: 'Option 2',
        id: 'opt-2'
      }
    ]
    const radio = Enzyme.mount(
      <RadioButtonGroup options={ options } value='opt-2' onChange={ exampleClick } name='radio-button' label='radio' formData={ exampleFormData } />
    )

    assert.ok((radio).text().indexOf('Option 2') >= 0)
  })
})

describe('<TextArea />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Text Area'
    const textarea = Enzyme.mount(
      <TextArea label={ exampleLabel } name='textarea' value={ exampleFormData.textarea.value } onChange={() => ''} />
    )

    assert.ok((textarea).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<TextInput />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example Text Input'
    const textinput = Enzyme.mount(
      <TextInput label={exampleLabel} name='textinput' value={exampleFormData.textinput.value} onChange={() => ''} onFocus={() => ''} />
    )

    assert.ok((textinput).text().indexOf(exampleLabel) >= 0)
  })
})

describe('<ToggleSwitch />', () => {
  it ('renders without breaking', () => {
    const exampleLabel = 'Example ToggleSwitch'
    const toggle = Enzyme.mount(
      <ToggleSwitch labelText={ exampleLabel } name='toggle-switch' onClick={ exampleClick } isActive={ true } formData={ exampleFormData } />
    )

    assert.ok((toggle).text().indexOf(exampleLabel) >= 0)
  })
})
