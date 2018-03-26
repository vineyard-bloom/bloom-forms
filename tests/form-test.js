import { describe, it } from 'mocha'
import * as assert from 'assert'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import { combineReducers, createStore } from 'redux'

Enzyme.configure({ adapter: new Adapter() })

import shallowWithStore from './helpers/shallow-with-store'
// import { addFormError, clearForm, createForm, deleteFormError, updateForm } from '../src/formActions'
import formReducer from '../src/formReducer'
import { Form } from '../src/form' // unconnected from redux
import { Form as ConnectedForm } from '../src' // fully connected to redux

const store = createStore(combineReducers({ forms: formReducer }))
const fieldNames = ['name', 'id', 'pet', 'muffinflavor', 'fileInput']

const submitProcess = (formData, files) => {
  console.log('submitting with formData: ', formData)
  console.log('submitting with files: ', files)
}

function generateComponent(store, replacementProps={}) {
  const component = <ConnectedForm fieldNames={fieldNames} id='example-form' submitForm={submitProcess} testMode={true} { ...replacementProps } />
  return shallowWithStore(component, store)
}

function comparableArray(array) {
  return array.sort().toString()
}

describe('<Form/>', function() {
  it ('has state', function() {
    const wrapper = generateComponent(store)
    assert.deepEqual(wrapper.state(), {})
  })

  it ('receives props', function() {
    const wrapper = generateComponent(store)
    assert.ok(wrapper.props())
    assert.ok(wrapper.instance().componentWillReceiveProps)
  })

  it ('communicates with redux form store', function() {
    const wrapper = generateComponent(store)
    wrapper.props().updateForm(null, 'example-form', 'name', 'Bob', 'text', { 'name': { value: '' } })
    wrapper.update()
    const thisFormStore = wrapper.props().forms['example-form'].fields
    assert.ok(thisFormStore)
    assert.ok(thisFormStore.name)
    assert.ok(thisFormStore.name.value)
    assert.equal(thisFormStore.name.value, 'Bob')
  })

  it ('updates values of fields when they change', function() {
    const wrapper = generateComponent(store)
    const diver = wrapper.dive().instance()

    diver.manualFieldUpdate('example-form', 'name', 'new value')
    wrapper.update()
    assert.ok(wrapper.props().forms['example-form'].fields.name.value)
    assert.equal(
      wrapper.props().forms['example-form'].fields.name.value,
      'new value'
    )

    diver.manualFieldUpdate('example-form', 'name', '')
    wrapper.update()
    assert.ok(wrapper.props().forms['example-form'].fields.name)
    assert.equal(
      wrapper.props().forms['example-form'].fields.name.value,
      ''
    )
  })

  it ('checks a field and returns whether it\'s valid', async function() {
    const wrapper = generateComponent(store)
    const fakeInput = {
      value: '',
      name: 'fake-input',
      required: true,
      'data-validate': 'not-empty',
      getAttribute: (field) => fakeInput[field]
    }
    const firstValid = await wrapper.dive().instance().checkField(null, fakeInput)
    assert.equal(firstValid, false)

    fakeInput.value = 'not empty anymore'
    const secondValid = await wrapper.dive().instance().checkField(null, fakeInput)
    assert.equal(secondValid, true)

    const fakeInput2 = {
      ...fakeInput,
      name: 'fake-input-2',
      'data-validate': 'email',
      value: 'email@example.com',
      getAttribute: (field) => fakeInput2[field]
    }
    const thirdValid = await wrapper.dive().instance().checkField(null, fakeInput2)
    assert.equal(thirdValid, true)

    fakeInput2.value = 'notanemail'
    const fourthValid = await wrapper.dive().instance().checkField(null, fakeInput2)
    assert.equal(fourthValid, false)

    fakeInput2.value = 'revertingemail@example.com'
    const fifthValid = await wrapper.dive().instance().checkField(null, fakeInput2)
    assert.equal(fifthValid, true)
  })

  it ('processes data for submission (without changing the redux state)', function() {
    const wrapper = generateComponent(store)
    const propsFields = wrapper.props().forms['example-form'].fields
    const processedFields = wrapper.dive().instance().processFormDataForSubmit(propsFields)

    assert.ok(processedFields)
    assert.deepEqual(processedFields, {
      name: '',
      id: '',
      muffinflavor: '',
      pet: '',
      fileInput: ''
    })

    // make sure redux example-form was unaffected
    wrapper.update()
    assert.deepEqual(wrapper.props().forms['example-form'].fields, propsFields)
  })

  it ('updates the store when receiving new fieldNames', function() {
    const wrapper = generateComponent(store)
    assert.equal(wrapper.props().fieldNames, fieldNames)

    const newFieldNames = ['name', 'id', 'pet', 'muffinflavor', 'blep']
    wrapper.setProps({ ...wrapper.props(), fieldNames: newFieldNames })
    wrapper.update()
    assert.equal(
      comparableArray(wrapper.props().fieldNames),
      comparableArray(newFieldNames)
    )

    wrapper.dive().instance().populateFields({ ...wrapper.props(), fieldNames: newFieldNames })
    wrapper.update()
    assert.equal(
      comparableArray(Object.keys(wrapper.props().forms['example-form'].fields)),
      comparableArray(newFieldNames)
    )
  })

  it ('prepopulates if given data', function() {
    const prepopulateData = {
      'muffinflavor': 'banana nut',
      'pet': 'Doodle',
      'stuff': {
        'id': '123-id'
      }
    }
    const wrapper = generateComponent(store)
    wrapper.setProps({ ...wrapper.props(), prepopulateData })
    wrapper.update()
    wrapper.dive().instance().populateFields(wrapper.props(), prepopulateData)
    wrapper.update()

    const thisFormStore = wrapper.props().forms['example-form'].fields
    assert.equal(
      thisFormStore.muffinflavor.value,
      prepopulateData.muffinflavor
    )
    assert.equal(
      thisFormStore.pet.value,
      prepopulateData.pet
    )
    assert.equal(
      thisFormStore.id.value,
      prepopulateData.stuff.id
    )
  })

  it ('triggers multiple checkFields when receiving awaitingCheck prop', function() {
    const initialProps = {
      fieldNames,
      id: 'example-form',
      submitForm: submitProcess
    }

    // create fake elements so the dom can access them for field checking
    const nameElem = document.createElement('input')
    const idElem = document.createElement('input')
    nameElem.setAttribute('id', 'name')
    idElem.setAttribute('id', 'id')

    document.body.appendChild(nameElem)
    document.body.appendChild(idElem)
    const wrapper = mount(<Form { ...initialProps } />)

    const receivedPropsSpy = sinon.spy(wrapper.instance(), 'componentWillReceiveProps')
    const checkFieldSpy = sinon.spy(wrapper.instance(), 'checkField')

    const updatedProps = { ...initialProps, forms: {
      'example-form': {
        fields: {},
        awaitingCheck: [{ formId: 'example-form', fieldNames: ['name', 'id'] }]
      }
    }}

    wrapper.setProps(updatedProps)
    wrapper.update()

    assert.equal(receivedPropsSpy.calledOnce, true)
    assert.equal(checkFieldSpy.called, true)
  })
})

describe('<Form/>: Submit Form', function() {
  it ('populates fields and submits form without error', async function() {
    const wrapper = generateComponent(store)
    const diver = wrapper.dive().instance()

    diver.manualFieldUpdate('example-form', 'name', 'Cletus')
    diver.manualFieldUpdate('example-form', 'id', '4')
    diver.manualFieldUpdate('example-form', 'pet', 'goat')
    diver.manualFieldUpdate('example-form', 'muffinflavor', 'blueberry')

    wrapper.update()

    const eventMock = { preventDefault: () => {}, target: { id: '' } }

    const updatedDiver = wrapper.dive().instance()

    const expectedFormData = {
      name: 'Cletus',
      id: '4',
      pet: 'goat',
      muffinflavor: 'blueberry',
      fileInput: ''
    }

    const result = await updatedDiver.forwardToSubmitForm(eventMock)

    assert.equal(
      wrapper.props().forms['example-form'].fields.name.value,
      'Cletus'
    )
    assert.equal(
      wrapper.props().forms['example-form'].fields.id.value,
      4
    )
    assert.equal(
      wrapper.props().forms['example-form'].fields.pet.value,
      'goat'
    )
    assert.equal(
      wrapper.props().forms['example-form'].fields.muffinflavor.value,
      'blueberry'
    )
    assert.deepEqual(result.thisForm, expectedFormData)
  })

  it ('populates fields and submits form, file included', async function() {
    const wrapper = generateComponent(store)
    const diver = wrapper.dive().instance()

    const eventMock = { preventDefault: () => {}, target: { id: '' } }
    const fileMock = { type: 'file', name:'fakeFile', size: 2000}

    diver.manualFieldUpdate('example-form', 'name', 'Dwight')
    diver.manualFieldUpdate('example-form', 'fileInput', fileMock, 'file')

    wrapper.update()
    const updatedDiver = wrapper.dive().instance()

    const expectedFormData = {
      name: 'Dwight',
      id: '',
      pet: '',
      muffinflavor: '',
      fileInput: { type: 'file', name: 'fakeFile', size: 2000 } 
    }

    const result = await updatedDiver.forwardToSubmitForm(eventMock)

    assert.equal(
      wrapper.props().forms['example-form'].fields.name.value,
      'Dwight'
    )
    assert.deepEqual(result.thisForm, expectedFormData)
  })
})
