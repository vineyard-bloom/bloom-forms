import React from 'react';
import * as assert from 'assert';
import Enzyme from 'enzyme';
import { combineReducers, createStore, dispatch } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import shallowWithStore from './helpers/shallow-with-store';
import { addFormError, clearForm, createForm, deleteFormError, updateForm } from '../src/formActions';
import formReducer from '../src/formReducer';
import { Form } from '../src/form'; // unconnected from redux
import { Form as ConnectedForm } from '../src' // fully connected to redux

const store = createStore(combineReducers({ forms: formReducer }));
const fieldNames = ['name', 'id', 'pet', 'muffinflavor'];

const submitProcess = (formData, files, success, fail) => {
  console.log('submitting with formData: ', formData);
}

function generateComponent(store, replacementProps={}) {
  const component = <ConnectedForm fieldNames={fieldNames} id='example-form' submitForm={submitProcess} { ...replacementProps } />
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
    wrapper.props().updateForm(null, 'example-form', 'name', 'Bob', 'text', { 'name': { value: '' } });
    const thisFormStore = wrapper.props().forms['example-form']
    assert.ok(thisFormStore);
    assert.ok(thisFormStore.name);
    assert.ok(thisFormStore.name.value);
    assert.equal(thisFormStore.name.value, 'Bob');
  })

  it ('updates values of fields when they change', function() {
    const wrapper = generateComponent(store)
    const diver = wrapper.dive().instance()

    diver.manualFieldUpdate('example-form', 'name', 'new value')
    assert.ok(wrapper.props().forms['example-form'].name.value)
    assert.equal(
      wrapper.props().forms['example-form'].name.value,
      'new value'
    )

    diver.manualFieldUpdate('example-form', 'name', '')
    assert.ok(wrapper.props().forms['example-form'].name)
    assert.equal(
      wrapper.props().forms['example-form'].name.value,
      ''
    )
  })

  it ('updates the store when receiving new fieldNames', function() {
    const wrapper = generateComponent(store)
    assert.equal(wrapper.props().fieldNames, fieldNames)

    const newFieldNames = ['name', 'id', 'pet', 'muffinflavor', 'blep'];
    wrapper.setProps({ ...wrapper.props(), fieldNames: newFieldNames })
    wrapper.update()
    assert.equal(
      comparableArray(wrapper.props().fieldNames),
      comparableArray(newFieldNames)
    )

    wrapper.dive().instance().populateFields({ ...wrapper.props(), fieldNames: newFieldNames })
    assert.equal(
      comparableArray(Object.keys(wrapper.props().forms['example-form'])),
      comparableArray([ ...newFieldNames, 'isValid' ])
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

    const thisFormStore = wrapper.props().forms['example-form']
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
})
