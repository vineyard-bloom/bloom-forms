import { before, beforeEach, describe, it } from 'mocha'
import React from 'react'
import * as assert from 'assert'
import Enzyme from 'enzyme'

import testConfigure from './helpers/configure-test'
import SelectInput from '../src/inputs/select-input.jsx'

// test against values with numbers too

testConfigure()

const exampleFormData = {
  'select-typeahead': { value: '' },
  'select-button': { value: '' },
  'select-button-numbers': { value: '' }
}
const options = [
  {
    label: 'A',
    value: 'a'
  },
  {
    label: 'B',
    value: 'b'
  },
  {
    label: 'C',
    value: 'c'
  }
]

let value = 'c'

const updateValue = (formId, fieldName, fieldValue) => {
  value = fieldValue
}

describe('<SelectInput />', () => {
  const exampleLabel = 'Example Select Input'
  const typeaheadInput = (
    <SelectInput
      formData={ exampleFormData }
      formId='example-form'
      label={ exampleLabel }
      name='select-typeahead'
      onChange={ updateValue }
      options={ options }
      value={ value }
    />
  )
  const buttonInput = (
    <SelectInput
      formData={ exampleFormData }
      formId='example-form'
      label={ exampleLabel }
      name='select-button'
      onChange={ updateValue }
      options={ options.map(opt => opt.value) }
      typeAhead={ false }
      value={ value }
    />
  )
  const numberValueInput = (
    <SelectInput
      formData={ exampleFormData }
      formId='example-form'
      label={ exampleLabel }
      name='select-button-numbers'
      onChange={ updateValue }
      options={ options.map((opt,i) => i+1) }
      typeAhead={ false }
      value={ value }
    />
  )

  // make sure there are separate divs to attach each to
  const root1 = document.createElement('div')
  root1.id = 'root-1'
  const root2 = document.createElement('div')
  root2.id = 'root-2'
  const root3 = document.createElement('div')
  root3.id = 'root-3'
  document.getElementById('root').appendChild(root1)
  document.getElementById('root').appendChild(root2)
  document.getElementById('root').appendChild(root3)

  const typeaheadSelectWrapper = Enzyme.mount(typeaheadInput, { attachTo: document.getElementById('root-1') })
  const buttonSelectWrapper = Enzyme.mount(buttonInput, { attachTo: document.getElementById('root-2') })
  const numberSelectWrapper = Enzyme.mount(numberValueInput, { attachTo: document.getElementById('root-3') })

  function resetWrappers() {
    typeaheadSelectWrapper.unmount()
    typeaheadSelectWrapper.mount(typeaheadInput, { attachTo: document.getElementById('root-1') })

    buttonSelectWrapper.unmount()
    buttonSelectWrapper.mount(buttonInput, { attachTo: document.getElementById('root-2') })
  }

  describe('tests set up with root for mounting', () => {
    it ('is ready to test', () => {
      assert.ok(document.getElementById('root'))
      assert.ok(document.getElementById('select-typeahead'))
      assert.ok(document.getElementById('select-button'))
      assert.ok(document.getElementById('select-button-numbers'))
    })
  })

  describe('rendering correctly:', () => {
    it ('renders the selected option\'s label if the option is an object', () => {
      const typeaheadValue = typeaheadSelectWrapper.find('#select-typeahead-placeholder').instance().value
      assert.equal(typeaheadValue, 'C')
    })

    it ('renders the selected option\'s value if the option is a string or number', () => {
      const buttonValue = buttonSelectWrapper.find('#select-button-placeholder').text()
      assert.equal(buttonValue, 'c')
    })

    it ('renders the typeahead by default', () => {
      const typeahead = typeaheadSelectWrapper.find('#select-typeahead-placeholder')
      assert.equal(typeahead.type(), 'input')
    })

    it ('renders the select with no typeahead if `typeAhead` prop is false', () => {
      const button = buttonSelectWrapper.find('#select-button-placeholder')
      assert.equal(button.type(), 'button')
    })
  })

  describe('opening and closing event behavior:', () => {
    beforeEach(() => resetWrappers())

    it ('hides the options by default (typeahead)', () => {
      const typeaheadOptions = typeaheadSelectWrapper.find('.SelectInput-opts')
      assert.equal(typeaheadSelectWrapper.state().showList, false)
      assert.ok(!typeaheadOptions.length)
    })
    it ('hides the options by default (button)', () => {
      const buttonOptions = buttonSelectWrapper.find('.SelectInput-opts')
      assert.equal(buttonSelectWrapper.state().showList, false)
      assert.ok(!buttonOptions.length)
    })

    it ('opens the options on focus (typeahead)', () => {
      typeaheadSelectWrapper.simulate('focus')
      typeaheadSelectWrapper.update()

      // ensure the options are now visible
      const typeaheadOptions = typeaheadSelectWrapper.find('.SelectInput-opts')
      assert.ok(typeaheadSelectWrapper.state().showList)
      assert.equal(typeaheadOptions.length, 1)
    })
    it ('opens the options on focus (button)', () => {
      buttonSelectWrapper.simulate('focus')
      buttonSelectWrapper.update()

      // ensure the options are now visible
      const buttonOptions = buttonSelectWrapper.find('.SelectInput-opts')
      assert.ok(buttonSelectWrapper.state().showList)
      assert.equal(buttonOptions.length, 1)
    })

    it ('selecting an option hides the list of options and focuses back on the original input (typeahead)', () => {
      // make sure options are visible
      typeaheadSelectWrapper.simulate('focus')
      typeaheadSelectWrapper.update()
      assert.ok(typeaheadSelectWrapper.state().showList)

      // arrow down to first option
      typeaheadSelectWrapper.simulate('keyDown', { keyCode: 40 })
      typeaheadSelectWrapper.update()
      assert.equal(typeaheadSelectWrapper.state().focusedOption, 'a')

      // ensure the first option is what we expect
      const option1 = typeaheadSelectWrapper.find('.SelectInput-opts').childAt(0).find('button')
      assert.equal(option1.text(), 'A')

      // select an option
      option1.simulate('click')
      typeaheadSelectWrapper.update()
      assert.ok(!typeaheadSelectWrapper.state().showList)
    })
    it ('selecting an option hides the list of options and focuses back on the original input (button)', () => {
      // make sure options are visible
      buttonSelectWrapper.simulate('keyDown', { keyCode: 40 })
      buttonSelectWrapper.update()
      assert.ok(buttonSelectWrapper.state().showList)
      assert.equal(buttonSelectWrapper.state().focusedOption, 'a')

      // // grab first option and ensure that it's what we expect
      const option1 = buttonSelectWrapper.find('.SelectInput-opts').childAt(0).find('button')
      assert.equal(option1.text(), 'a')

      // // select an option
      option1.simulate('click')
      buttonSelectWrapper.update()
      assert.ok(!buttonSelectWrapper.state().showList)
    })

    it ('typing ESC key when options are open closes the options and focuses back on the original input (typeahead)', () => {
      // focus on wrapper and trigger option open
      typeaheadSelectWrapper.simulate('focus')
      typeaheadSelectWrapper.update()

      // ensure the options are now visible
      const typeaheadOptions = typeaheadSelectWrapper.find('.SelectInput-opts')
      assert.ok(typeaheadSelectWrapper.state().showList)
      assert.equal(typeaheadOptions.length, 1)

      // ESC
      typeaheadSelectWrapper.simulate('keyDown', { keyCode: 27 })
      typeaheadSelectWrapper.update()
      assert.equal(typeaheadSelectWrapper.state().showList, false)
      assert.equal(document.activeElement.id, 'select-typeahead-placeholder')
    })
    it ('typing ESC key when options are open closes the options and focuses back on the original input (button)', () => {
      // focus on wrapper and trigger option open
      buttonSelectWrapper.simulate('focus')
      buttonSelectWrapper.update()

      // ensure the options are now visible
      const buttonOptions = buttonSelectWrapper.find('.SelectInput-opts')
      assert.ok(buttonSelectWrapper.state().showList)
      assert.equal(buttonOptions.length, 1)

      // ESC
      buttonSelectWrapper.simulate('keyDown', { keyCode: 27 })
      buttonSelectWrapper.update()
      assert.equal(buttonSelectWrapper.state().showList, false)
      assert.equal(document.activeElement.id, 'select-button-placeholder')
    })
  })

  describe('arrow keys up and down go to prev/next and wrap to other end of options:' , () => {
    it ('arrow down when the options are hidden opens the options (typeahead)', () => {
      resetWrappers()

      // make sure options are visible
      typeaheadSelectWrapper.simulate('focus')
      typeaheadSelectWrapper.update()
      assert.ok(typeaheadSelectWrapper.state().showList)

      // arrow down to first option
      typeaheadSelectWrapper.simulate('keyDown', { keyCode: 40 })
      typeaheadSelectWrapper.update()
      assert.equal(typeaheadSelectWrapper.state().focusedOption, 'a')

      // ensure the first option is what we expect
      const option1 = typeaheadSelectWrapper.find('.SelectInput-opts').childAt(0).find('button')
      assert.equal(option1.text(), 'A')

      // select an option
      option1.simulate('click')
      typeaheadSelectWrapper.update()
      assert.ok(!typeaheadSelectWrapper.state().showList)

      // make sure we're focused on typeahead
      assert.equal(document.activeElement.id, 'select-typeahead-placeholder')

      // arrow down and make sure the options open again
      typeaheadSelectWrapper.simulate('keyDown', { keyCode: 40 })
      typeaheadSelectWrapper.update()
      assert.ok(typeaheadSelectWrapper.state().showList)
    })
    it ('arrow down when the options are visible goes to the next option (typeahead)', () => {
      // continue the previous test
      assert.equal(document.activeElement.id, 'input-select-typeahead-placeholder-a')
    })
    it ('arrow up when the options are visible goes to the prevous option (typeahead)', () => {
      // continue the previous test
      typeaheadSelectWrapper.simulate('keyDown', { keyCode: 38 })
      typeaheadSelectWrapper.update()
      assert.equal(document.activeElement.id, 'input-select-typeahead-placeholder-c')
    })

    it ('arrow down when the options are hidden opens the options (button with number values)', () => {
      resetWrappers()

      // make sure options are visible
      numberSelectWrapper.simulate('focus')
      numberSelectWrapper.update()
      assert.ok(numberSelectWrapper.state().showList)

      // arrow down to first option
      numberSelectWrapper.simulate('keyDown', { keyCode: 40 })
      numberSelectWrapper.update()
      assert.equal(numberSelectWrapper.state().focusedOption, '1')

      // ensure the first option is what we expect
      const option1 = numberSelectWrapper.find('.SelectInput-opts').childAt(0).find('button')
      assert.equal(option1.text(), '1')

      // select an option
      option1.simulate('click')
      numberSelectWrapper.update()
      assert.ok(!numberSelectWrapper.state().showList)

      // make sure we're focused on button trigger
      assert.equal(document.activeElement.id, 'select-button-numbers-placeholder')

      // arrow down and make sure the options open again
      numberSelectWrapper.simulate('keyDown', { keyCode: 40 })
      numberSelectWrapper.update()
      assert.ok(numberSelectWrapper.state().showList)
    })
    it ('arrow down when the options are visible goes to the next option (button with number values)', () => {
      // continue the previous test
      assert.equal(document.activeElement.id, 'input-select-button-numbers-placeholder-1')
    })
    it ('arrow up when the options are visible goes to the prevous option (button with number values)', () => {
      // continue the previous test
      numberSelectWrapper.simulate('keyDown', { keyCode: 38 })
      numberSelectWrapper.update()
      assert.equal(document.activeElement.id, 'input-select-button-numbers-placeholder-3')
    })

    it ('arrow down when the options are hidden opens the options (button)', () => {
      resetWrappers()

      // make sure options are visible
      buttonSelectWrapper.simulate('focus')
      buttonSelectWrapper.update()
      assert.ok(buttonSelectWrapper.state().showList)

      // arrow down to first option
      buttonSelectWrapper.simulate('keyDown', { keyCode: 40 })
      buttonSelectWrapper.update()
      assert.equal(buttonSelectWrapper.state().focusedOption, 'a')

      // ensure the first option is what we expect
      const option1 = buttonSelectWrapper.find('.SelectInput-opts').childAt(0).find('button')
      assert.equal(option1.text(), 'a')

      // select an option
      option1.simulate('click')
      buttonSelectWrapper.update()
      assert.ok(!buttonSelectWrapper.state().showList)

      // make sure we're focused on trigger
      assert.equal(document.activeElement.id, 'select-button-placeholder')

      // arrow down and make sure the options open again
      buttonSelectWrapper.simulate('keyDown', { keyCode: 40 })
      buttonSelectWrapper.update()
      assert.ok(buttonSelectWrapper.state().showList)
    })
    it ('arrow down when the options are visible goes to the next option (button)', () => {
      // continue the previous test
      assert.equal(document.activeElement.id, 'input-select-button-placeholder-a')
    })
    it ('arrow up when the options are visible goes to the prevous option (button)', () => {
      // continue the previous test
      buttonSelectWrapper.simulate('keyDown', { keyCode: 38 })
      buttonSelectWrapper.update()
      assert.equal(document.activeElement.id, 'input-select-button-placeholder-c')
    })
  })

  describe('displays and hides errors appropriately:', () => {
    before(() => resetWrappers())

    it ('displays an error when it has an error', () => {
      typeaheadSelectWrapper.setProps({ error: 'Error!' })
      typeaheadSelectWrapper.update()
      assert.ok(typeaheadSelectWrapper.find('.ErrorTip--select').length)
    })

    it ('styles the input as --invalid if it has an error', () => {
      // continue previous test
      assert.ok(typeaheadSelectWrapper.find('#select-typeahead-placeholder').hasClass('Input--invalid'))
    })

    it ('hides the error when it doesn\'t have an error', () => {
      // continue previous test
      typeaheadSelectWrapper.setProps({ error: '' })
      typeaheadSelectWrapper.update()
      assert.ok(!typeaheadSelectWrapper.find('.ErrorTip--select').length)
    })

    it ('does not style the input as --invalid if it doesn\'t have an error', () => {
      // continue previous test
      assert.ok(!typeaheadSelectWrapper.find('#select-typeahead-placeholder').hasClass('Input--invalid'))
    })
  })
})
