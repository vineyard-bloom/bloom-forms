# Bloom Forms

#### All your form functionality in one place.

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

### [<Form/> Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md)
### [Props passed down to child inputs](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/children-props.md)
### [Bloom Inputs](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md)

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
Fork this repo, run `yarn test` and ensure everything passes, then bundle with `yarn build`. Accepted PRs will be merged and published to npm.

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
