import React from 'react';
import * as assert from 'assert';
import { mount, shallow } from 'enzyme';
import { combineReducers, createStore, dispatch } from 'redux';

import { addFormError, clearForm, createForm, deleteFormError, updateForm } from '../src/formActions';
import formReducer from '../src/formReducer';
import { Form } from '../src';

const exampleApp = combineReducers({
    forms:        formReducer
});

const store = createStore(exampleApp);

const fieldNames = ['name', 'id', 'pet', 'muffinflavor'];

const submitProcess = (formData, files, success, fail) => {
  console.log('submitting with formData: ', formData);
}

const startingState = {
    prepopulated: false,
    processingRequest: false
  }

describe('<Form/>', function() {
  it ('should have state', function() {
    const wrapper = shallow(<Form store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    assert.deepEqual(wrapper.state(), {})
  })

  it ('should receive props', function() {
    const wrapper = shallow(<Form store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    assert.ok(wrapper.props())
    assert.ok(wrapper.instance().componentWillReceiveProps)
  })

  it ('should communicate with redux form store', function() {
    const wrapper = shallow(<Form store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    wrapper.props().updateForm(null, 'example-form', 'name', 'Bob', 'text');
    assert.ok(wrapper.props().forms['example-form']);
    assert.ok(wrapper.props().forms['example-form'].name);
    assert.ok(wrapper.props().forms['example-form'].name.value);
    assert.equal(wrapper.props().forms['example-form'].name.value, 'Bob');
  })
})