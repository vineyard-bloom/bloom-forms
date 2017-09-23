import React from 'react';
import sinon from 'sinon';
import * as assert from 'assert';
import { mount, shallow } from 'enzyme';
import { combineReducers, createStore, dispatch } from 'redux';
import { Provider } from 'react-redux';

import { addFormError, clearForm, createForm, deleteFormError, updateForm } from '../src/formActions';
import formReducer from '../src/formReducer';
import { Form } from '../src/form';
import { Form as ConnectedForm } from '../src'

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
  it ('has state', function() {
    const wrapper = shallow(<ConnectedForm store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    assert.deepEqual(wrapper.state(), {})
  })

  it ('receives props', function() {
    const wrapper = shallow(<ConnectedForm store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    assert.ok(wrapper.props())
    assert.ok(wrapper.instance().componentWillReceiveProps)
  })

  it ('communicates with redux form store', function() {
    const wrapper = shallow(<ConnectedForm store={store} fieldNames={fieldNames} id='example-form' submitForm={submitProcess}/>);
    wrapper.props().updateForm(null, 'example-form', 'name', 'Bob', 'text');
    assert.ok(wrapper.props().forms['example-form']);
    assert.ok(wrapper.props().forms['example-form'].name);
    assert.ok(wrapper.props().forms['example-form'].name.value);
    assert.equal(wrapper.props().forms['example-form'].name.value, 'Bob');
  })

  it ('updates the store when receiving new fieldNames', function() {
    function tempCreateForm(id, dataObj) {
      return store.dispatch(createForm(id, dataObj));
    }
    const wrapper = shallow(<Form fieldNames={fieldNames} id='example-form' submitForm={submitProcess} />);
    const spy = sinon.spy(wrapper.instance(), 'componentWillReceiveProps');
    const spy2 = sinon.spy(wrapper.instance(), 'populateFields');

    wrapper.update();
    assert.equal(spy.calledOnce, false);
    assert.equal(spy2.callCount, 0);
    wrapper.setProps({ ...store.getState(), createForm: tempCreateForm, fieldNames: ['name', 'id', 'pet', 'muffinflavor', 'blep']});

    assert.equal(spy.calledOnce, true);
    assert.equal(spy2.callCount, 1);

    assert.ok(store.getState().forms['example-form']);
    assert.ok(store.getState().forms['example-form'].blep);
  })

  it ('prepopulates if given data', function() {
    function tempCreateForm(id, dataObj) {
      return store.dispatch(createForm(id, dataObj));
    }
    const wrapper = shallow(<Form fieldNames={fieldNames} id='example-form' submitForm={submitProcess} />);
    const spy = sinon.spy(wrapper.instance(), 'componentWillReceiveProps');
    const spy2 = sinon.spy(wrapper.instance(), 'populateFields');

    wrapper.update();
    assert.equal(spy.calledOnce, false);
    assert.equal(spy2.callCount, 0);
    wrapper.setProps({ ...store.getState(), createForm: tempCreateForm, prepopulateData: {name: 'Bob'}});

    assert.equal(spy.calledOnce, true);
    assert.equal(spy2.callCount, 1);

    assert.ok(store.getState().forms['example-form']);
    assert.ok(store.getState().forms['example-form'].name);
    assert.equal(store.getState().forms['example-form'].name.value, 'Bob')
  })
})
