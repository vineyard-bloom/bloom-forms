import React from 'react';
import sinon from 'sinon';
import * as assert from 'assert';
import { mount, shallow } from 'enzyme';
import { combineReducers, createStore, dispatch } from 'redux';
import { Provider } from 'react-redux';

import { addFormError, clearForm, createForm, deleteFormError, updateForm } from '../src/formActions';
import formReducer from '../src/formReducer';
import { Form } from '../src/form'; // unconnected from redux
import { Form as ConnectedForm } from '../src' // fully connected to redux

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

  it ('validates when told to', function() {
    const validationHelp = {
      errorLanguage: {
        'not-empty': 'This field cannot be empty.'
      }
    }
    const wrapper = shallow(<Form fieldNames={fieldNames} id='example-form' submitForm={submitProcess} validationHelp={ validationHelp } />);
    const fakeElem = {
      value: '',
      name: 'name',
      'data-validate': 'not-empty',
      getAttribute: (thing) => {
        return fakeElem[thing]
      }
    }
    function tempCreateForm(id='example-form', dataObj) {
      return store.dispatch(createForm(id, dataObj));
    }
    function tempDeleteFormError(id='example-form', fieldName) {
      return store.dispatch(deleteFormError(id, fieldName))
    }
    function tempAddFormError(formId='example-form', fieldName, errorMessage) {
      return store.dispatch(addFormError(formId, fieldName, errorMessage))
    }

    wrapper.setProps({ deleteFormError: tempDeleteFormError, addFormError: tempAddFormError, createForm: tempCreateForm, forms: { 'example-form': {} } })
    wrapper.update();

    wrapper.instance().checkField(null, fakeElem)

    const thisForm = store.getState().forms['example-form']
    assert.ok(thisForm.name);
    assert.ok(!thisForm.name.value);
    assert.ok(thisForm.name.error);
    assert.equal(thisForm.name.error, validationHelp.errorLanguage['not-empty']);

    fakeElem.value = 'Bob';
    wrapper.instance().checkField(null, fakeElem);

    const thatForm = store.getState().forms['example-form']
    assert.ok(thatForm.name);
    assert.ok(!thatForm.name.error);
  })
})
