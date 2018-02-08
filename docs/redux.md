# Redux -- formActions, formReducer, and your Redux Store

## Contents:
  * [Redux Structure](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md#your-redux-store-structure)
  * [formActions](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md#formactions)
  * [formReducer]()

## Your Redux Store Structure
Wrapping your form in `<Form/>` initializes an object tracking all your form state for you. This object will look like:
```
forms: {
  formName: {
    awaitingCheck: [{ formId: 'formName', fieldNames: [ 'fieldName1', 'fieldName2' ] }],
    checkVisibleFields: true/false, // this triggers the <Form/> wrapper to update the visibleFields array below
    dirtyFields: [ 'fieldName1', 'fieldName2' ],
    fields: {
      fieldName1: { value: '', error: '' },
      fieldName2: { value: '', error: '' },
    },
    isValid: true/false,
    touchedFields: [ 'fieldName1', 'fieldName2' ],
    visibleFields: [ 'fieldName1', 'fieldName2' ]
  }
}
```


## formActions
`formActions` can be imported and any of its methods can be called like: `formActions.methodName`. Many of these methods will never *need* to be called directly, such as `createForm` -- they are used by the `<Form/>` wrapper. These internally-used methods have ** next to them. Some are not recommended to use directly as an external dispatch.

### Available Methods:
- `addFormError` ** :
  Takes in (formId, fieldName, errorMsg) as parameters and triggers an error addition to a specific field by name. Called by `checkField` method on `<Form />`.

- `checkCompleted` ** :
  Takes in (formId) as a parameter and removes that form from 'awaitingCheck' in Redux form state.

- `checkForVisibleFields`:
  Takes in (formId) as a parameter. External method that triggers the `<Form/>` wrapper to query the DOM, dispatch `updateVisibleFieldsArr` below, and create an array of visible fields.

- `checkMultipleFields`:
  Takes in (formId, fieldNames) parameters, the second being an array of name strings. External method that triggers the `<Form/>` to check all of the fields listed in `fieldNames`. `checkCompleted` is then run internally when all checks are complete.

- `clearForm`:
  Takes in (formId) as a parameter. Internally used when the form unmounts, but is useful to clear a form manually.

- `createForm` ** :
  Takes in (formId, formObject) as parameters. The formObject initializes the form with all its needed fields. Not recommended to use externally.

- `deleteFormError`:
  Takes in (formId, fieldName, errorMsg) as parameters. It is run automatically if `checkField` (from `<Form/>`) or `checkMultipleFields` finds an error has disappeared.

- `onFocus` ** :
  Takes in (formId, fieldName) as parameters. This adds fieldNames to the touched array in your Redux store. Not recommended to call externally.

- `updateForm` ** :
  Takes in several parameters, determining if the field should be updated based on event target or manual value passed in. Also triggers special updates if the value is for a file. It's not recommended to call this method via Redux but to the use the wrapper version from `<Form/>` already passed into your child components.

- `updateVisibleFieldsArr` ** :
  Used by `checkforVisibleFields` above. Not recommended to call externally.

## formReducer
The `formReducer` should be imported directly and added to your reducers file inside `combineReducers` like:
```
combineReducers({
  ...
  forms: formReducer
  ...
})
```
All of `formReducer`'s functionality is triggered via `formActions`.
