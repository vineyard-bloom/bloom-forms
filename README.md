# Bloom Forms

#### All your form functionality in one place.

## 1.0.0 Release Notes:
The 1.0.0 release comes with several useful hooks for developers to have more control over error handling -- particularly when the errors appear.

In Redux, each [form's structure](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md#your-redux-store-structure) has migrated from:
```
[form id]: {
  [key]: { value: '', error: '' }
  [key2]: { value: '', error: '' }
  isValid: bool
}
```
to
```
[form id]: {
  fields: {
    [key]: { value: '', error: '' }
    [key2]: { value: '', error: '' }
  ],
  awaitingChecks: [
    { formId: [form id], fieldNames: ['key1', 'key2'] }
  ],
  dirtyFields: ['key1'],
  touchedFields: ['key1', 'key2'],
  visibleFields: ['key1', 'key2']
  isValid: bool
}
```

Exposing which fields are dirtied (value has been changed), touched (input has been focused), and visible gives more control over when different event hooks occur. The most common use case for these fields are error-related, such as only having a `checkField` occur onBlur if that field has actually been dirtied.

NOTE that all field values and errors are now nested one level deeper in the Redux store. This will not affect any fields dependent on `formData`, but will affect any components that pull from Redux's form object directly to get field values. THIS IS A BREAKING API CHANGE FOR SOME USE CASES.

Other upgrades:

[`checkMultipleFields`](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md#formactions) method is now available via redux (in formActions). This will be processed via the `<Form/>` wrapper to check every field passed in. It is useful for wizard forms where you may want to execute batch checks on pages before triggering an actual submission.

`suppressErrors` boolean is available on each input. This prop hides errors from displaying when true, but doesn't prevent validation from running. It's useful when you want errors to execute, but do not want them displayed inline, or prefer for them not to be displayed until certain other criteria are met.

`validateAs` can now accept multiple validators, such as `validateAs='email min-length-4'`, and will execute each validator that is space-separated in successtion.

`<SelectInput />` now has a clearer visual distinction between filter text and actual selection, improving UX. If no value is selected, but the user is typing in the typeahead, the text is grayed and has 'Filtering by: ' in front of any characters entered.

Several persistent bug fixes, including:
- SelectInput's placeholder autofilling the typeahead instead of rendering as a placeholder.
- Dropzone's errors not appearing.
- FileInput not receiving normal tab order.
- Firefox not allowing clicks on SelectInput options.
- File uploads always being appended to the state instead of replacing any fields with the same name. Exception is if 'multiple' is passed in as a prop.


## DISCLAIMER:
All of the functionality in this library is compatible with React 15 and 16 EXCEPT for the arrowdown focus functionality on SelectInputs. Your project *must* use React 16 if you want fully accessible SelectInputs, due to the internal changes surrounding setState.


## Documentation

Features:
- Fully accessible, responsive and custom-stylable inputs.
- Integrates seamlessly with bloom-starter.
- All form actions available through redux.
- Fully customizable validation. Works through form.jsx and independently.

## Why use Bloom Forms?
* Built-in state management
* Built-in error handling
* Built-in form population
* Built-in accessibility
* All field values and errors available through Redux

Includes:

* Redux:
    - formActions.js
    - formReducer.js

* Components:
    - Form (form wrapper)
    - ErrorTip (default inline form errors)
    - form inputs
      * Button
      * Checkbox
      * CurrencyInput
      * Dropzone
      * FileInput
      * RadioGroup
      * RadioButtonGroup
      * SelectInput
      * TextArea
      * TextInput
      * ToggleSwitch

## README Contents:
### General:
- [Usage](https://github.com/vineyard-bloom/bloom-forms#usage)
- [Set Up](https://github.com/vineyard-bloom/bloom-forms#set-up)
- [Contributing](https://github.com/vineyard-bloom/bloom-forms#contributing)

### [`<Form/>` Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md)
### [Props passed down to child inputs](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/children-props.md)
### [Bloom Inputs](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md)
### [Redux -- Reducers, Actions, and Store format](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md)

## Usage
To use this package, you can install with either npm or yarn.
```
npm install bloom-forms --save
```
or
```
yarn add bloom-forms
```

To import one of the files/components in this package, import like:
```
import { formReducer } from 'bloom-forms';
```

## Contributing
Fork this repo, and submit any changes as a PR to master. Accepted PRs will be merged and published to npm.

## Set Up
- Every form needs two files: a container and a presentation component (with all the inputs inside it)
- The container should render the presentation component wrapped inside of the generic Form.jsx container. This wrapper handles all your state, updating redux, errors, etc.
- Example:
A login form might look like this: (simplified -- make sure all your inputs have required props, etc.)
```
const LoginForm = (props) => {
  return (
    <form id='login-form'>
      <TextInput name='username' value={ formData.username } />
      <TextInput name='password' isPassword={ true } value={ formData.password.value } onBlur={ props.checkField } />
      <Button text='submit' onClick={ props.submitForm } />
    </form>
  )
}
```
And its container would look like this:
```
class LoginFormContainer extends React.Component {
  submitForm = (formData, files, successCallback, failCallback) => {
    WebService.login(formData)
      .then(res => {
        successCallback()
      })
      .catch(err => {
        failCallback()
      })
  }

  render() {
    let fieldNames = ['username', 'password']
  
    return (
      <Form id='login-form' fieldNames={ fieldNames } submitForm={ this.submitForm }>
        <LoginForm />
      </Form>
    )
  }
}
```
- Note that the IDs match ('login-form'), and the fieldNames match the names of the TextInputs.

Now make sure that you've imported your `formReducer` into your reducers file in redux, like:
```
import { formReducer } from 'bloom-forms'
...

export default combineReducers({
  ...
  forms: formReducer
  ...
})
```

[Back to Contents](https://github.com/vineyard-bloom/bloom-forms#readme-contents)
