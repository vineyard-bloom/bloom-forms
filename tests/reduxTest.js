import * as assert from 'assert';
import { combineReducers, createStore, dispatch } from 'redux';
import {
  addFormError,
  checkCompleted,
  checkMultipleFields,
  clearForm,
  createForm,
  deleteFormError,
  updateForm
} from '../src/formActions';
import formReducer from '../src/formReducer';

const exampleApp = combineReducers({
    forms:        formReducer
});

const store = createStore(exampleApp);

describe('Bloom Form redux', function() {
  it ('dispatches new form named example-form', function() {
    const example = { fields: {}, awaitingCheck: [] }

    store.dispatch(createForm('example-form', example));

    assert.deepEqual(store.getState().forms['example-form'], { fields: example.fields, awaitingCheck: [], isValid: true });
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

    assert.deepEqual(store.getState().forms['example-form'].fields, exampleFields);
  })
})

describe('populates fieldNames after initialization', function() {
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

    assert.deepEqual(store.getState().forms['example-form'].fields, exampleFields);
  })

  it ('adds values to a couple fields', function() {
    store.dispatch(updateForm(null, 'example-form', 'name', 'Bob', 'text'))
    store.dispatch(updateForm(null, 'example-form', 'pet', 'dog', 'text'))

    const endComparison = {
      fields: {
        'name': { value: 'Bob' },
        'id': { value: '' },
        'pet': { value: 'dog' },
        'muffinflavor': { value: '' },
        'blep': { value: '' }
      },
      'isValid': true
    }

    assert.deepEqual(store.getState().forms['example-form'].fields, endComparison.fields)
    assert.equal(store.getState().forms['example-form'].isValid, endComparison.isValid)
  })
})

describe('handles errors', function() {
  it ('adds an error to blep', function() {
    store.dispatch(addFormError('example-form', 'blep', 'This field can\'t be empty.'))

    const endComparison = {
      fields: {
        'name': { value: 'Bob' },
        'id': { value: '' },
        'pet': { value: 'dog' },
        'muffinflavor': { value: '' },
        'blep': { value: '', error: 'This field can\'t be empty.' }
      },
      'isValid': false
    }

    assert.deepEqual(store.getState().forms['example-form'].fields, endComparison.fields)
    assert.equal(store.getState().forms['example-form'].isValid, endComparison.isValid)
  })

  it ('updates a value and deletes an error from blep', function() {
    store.dispatch(updateForm(null, 'example-form', 'blep', 'tiny tongue bleps', 'text'))
    store.dispatch(deleteFormError('example-form', 'blep', 'This field can\'t be empty.'))

    const endComparison = {
      fields: {
        'name': { value: 'Bob' },
        'id': { value: '' },
        'pet': { value: 'dog' },
        'muffinflavor': { value: '' },
        'blep': { value: 'tiny tongue bleps' }
      },
      'isValid': true
    }

    assert.deepEqual(store.getState().forms['example-form'].fields, endComparison.fields)
    assert.equal(store.getState().forms['example-form'].isValid, endComparison.isValid)
  })
})

describe('deals with awaitingCheck', function() {
  it ('adds fields that are awaitingCheck', function() {
    assert.deepEqual(
      store.getState().forms['example-form'].awaitingCheck,
      []
    )
    store.dispatch(checkMultipleFields('example-form', ['blep']))
    assert.deepEqual(
      store.getState().forms['example-form'].awaitingCheck,
      [{ formId: 'example-form', fieldNames: ['blep'] }]
    )
  })

  it ('removes fields that were awaitingCheck and are now checked', function() {
    store.dispatch(checkCompleted('example-form'))
    assert.deepEqual(
      store.getState().forms['example-form'].awaitingCheck,
      []
    )
  })
})

describe('empties out form for unmounting', function() {
  it ('deletes the contents of example-form', function() {
    store.dispatch(clearForm('example-form'))

    assert.deepEqual(store.getState().forms['example-form'], {})
  })
})
