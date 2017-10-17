import React from 'react';
import sinon from 'sinon';
import * as assert from 'assert';
import { mount, shallow } from 'enzyme';
import { combineReducers, createStore, dispatch } from 'redux';
import { Provider } from 'react-redux';

import Button from '../src/inputs/button.jsx';
import Checkbox from '../src/inputs/checkbox.jsx';
import CurrencyInput from '../src/inputs/currency-input.jsx';
import DateInput from '../src/inputs/date-input.jsx';
import Dropzone from '../src/inputs/dropzone.jsx';
import FileInput from '../src/inputs/file-input.jsx';
import RadioGroup from '../src/inputs/radio-group.jsx';
import SelectInput from '../src/inputs/select-input.jsx';
import TextArea from '../src/inputs/text-area.jsx';
import TextInput from '../src/inputs/text-input.jsx';
import ToggleSwitch from '../src/inputs/toggle-switch.jsx';

function exampleClick() {
  return;
}

describe('<Button />', function() {
  it ('renders without breaking', function() {
    const exampleText = 'example button';
    const button = mount(<Button text={ exampleText } onClick={ exampleClick } />);

    assert.ok((button).text().indexOf(exampleText) >= 0);
  })
})

describe('<Checkbox />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Checkbox';
    const checkbox = mount(<Checkbox name='checkbox' label={ exampleLabel } checked={ true } />);

    assert.ok((checkbox).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<CurrencyInput />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Currency Input';
    const currency = mount(<CurrencyInput label={ exampleLabel } name='currency-input' id='currency-input' />);

    assert.ok((currency).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<DateInput />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Date Input';
    const date = mount(<DateInput label={ exampleLabel } name='date-input' value='2017/12/12' onChange={ exampleClick } />);

    assert.ok((date).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<Dropzone />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Dropzone';
    const dropzone = mount(<Dropzone label={ exampleLabel } name='dropzone' onChange={ exampleClick } />);

    assert.ok((dropzone).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<FileInput />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example File Input';
    const file = mount(<FileInput label={ exampleLabel } name='file-input' formId='example-form' onChange={ exampleClick } id='example-form' />);

    assert.ok((file).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<RadioGroup />', function() {
  it ('renders without breaking', function() {
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
    const radio = mount(<RadioGroup options={ options } value='opt-2' onChange={ exampleClick } name='radio' />);

    assert.ok((radio).text().indexOf('Option 2') >= 0);
  })
})

describe('<SelectInput />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Select Input';
    const select = mount(<SelectInput label={ exampleLabel } name='select' formId='example-form' />);

    assert.ok((select).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<TextArea />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Text Area';
    const textarea = mount(<TextArea label={ exampleLabel } name='textarea' />);

    assert.ok((textarea).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<TextInput />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example Text Input';
    const textinput = mount(<TextInput label={ exampleLabel } name='textinput' />);

    assert.ok((textinput).text().indexOf(exampleLabel) >= 0);
  })
})

describe('<ToggleSwitch />', function() {
  it ('renders without breaking', function() {
    const exampleLabel = 'Example ToggleSwitch';
    const toggle = mount(<ToggleSwitch labelText={ exampleLabel } name='toggle-switch' onClick={ exampleClick } isActive={ true } />);

    assert.ok((toggle).text().indexOf(exampleLabel) >= 0);
  })
})
