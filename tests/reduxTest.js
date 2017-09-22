import * as assert from 'assert';
import { combineReducers, createStore, dispatch } from 'redux';
import { createForm, updateForm } from '../src/formActions';
import formReducer from '../src/formReducer';

const exampleApp = combineReducers({
    forms:        formReducer
});

const store = createStore(exampleApp);

describe('creates a new form', function() {
  it ('dispatches new form named example-form', function() {
    const exampleFields = {}

    store.dispatch(createForm('example-form', exampleFields));

    assert.deepEqual(store.getState().forms['example-form'], { ...exampleFields, isValid: true });
  })

  it ('adds fields to the example-form', function() {
    const exampleFields = {
      'name': { value: '' },
      'id': { value: '' },
      'pet': { value: '' },
      'muffinflavor': { value: '' }
    }

    for (let field in exampleFields) {
      store.dispatch(updateForm(null, 'example-form', field, exampleFields[field].value, 'text'));
    }

    assert.deepEqual(store.getState().forms['example-form'], { ...exampleFields, isValid: true });
  })
})

describe('populates fieldNames after already adding fieldNames', function() {
  it ('adds empty values for each new fieldName', function() {
    const newFields = ['name', 'id', 'pet', 'muffinflavor', 'blep']
    newFields.forEach((field) => {
      if (store.getState().forms['example-form'] && !store.getState().forms['example-form'][field]) {
        store.dispatch(updateForm(null, 'example-form', field, '', 'text'));
      }
    })

    const exampleFields = {
      'name': { value: '' },
      'id': { value: '' },
      'pet': { value: '' },
      'muffinflavor': { value: '' },
      'blep': { value: '' }
    }

    assert.deepEqual(store.getState().forms['example-form'], { ...exampleFields, isValid: true });
  })
})
