# Bloom Forms

#### All your form functionality in one place.

Files:
Redux:
- formActions.js
- formReducer.js

Components:
- form.jsx (form wrapper)
- form inputs

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
  render() {
    let fieldNames = ['username', 'password']
  
    return (
      <Form id='login-form' fieldNames={ fieldNames } submitRoute='/login'>
        <LoginForm />
      </Form>
    )
  }
}
```
- Note that the IDs match ('login-form'), and the fieldNames match the names of the TextInputs.

## Updating Form State
By default, inputs' values are updated via the `updateForm` method. It receives the event coming from changing that input and sets that field's value for you. You can stick it right on an input like:
```
<TextInput onChange={this.props.updateForm} />
```

You can also manually update a field. Say you have a button that changes the value of a text input. You would want to manually pass in which values and which fields are needed. You can do this through `manualFieldUpdate`, which accepts three parameters: the formId, the fieldValue, and the fieldName. To use:
```
const { formData, formId, manualFieldUpdate } = this.props

...

<Button onClick={ () => this.props.manualFieldUpdate(formId, 'Choice #1 - Blah', 'choice') }>
  Choice #1
</Button>
<TextInput name='choice' value={ formData.choice.value } />

...
```

## Validation
All the existing inputs have support for a `validateAs` string and an `onBlur` (when that field loses focus) function prop, which should call `props.checkField`. You can add more types of validaton to the validator file in util/.

- Example:
You have a field that you want to validate as one of 3 pets. You're calling this 'isAPet'. You add a case to the validator dict:
```
    ...
    'file': fileError,
    'isAPet': petError,
    ...
```
and also create a function that returns an error if it isn't one of the 3 pets.
```
function petError(testData, fieldName) {
  return testData === 'dog' || testData === 'cat' || testData === 'bird'
    ? 'Not a known pet type.'
    : null
}
```

To use this set up, an example field would look like:
```
<TextInput name='pet' validateAs='isAPet' onBlur={ props.checkField } onChange={ props.updateForm }
  value={ formData.pet.value } error={ formData.pet.error } />
```

You don't need to change anything inside Form.jsx.

## Forms with Switch Inside
To make forms with Routes inside, you will need to make the Switch its own Container inside another form container and pass in the props with a spread operator.

For example:
Outermost container:
```
class RegistrationFormContainer extends React.Component {
  render() {
    return (
      <Form id='registration-form' fieldNames={ fieldNames } submitRoute='/user/register'>
        <RegistrationFormSwitch />
      </Form>
    )
  }
}
```
Switch container:
```
class RegistrationFormSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/step1' render={ () => <StepOne { ...this.props } /> } />
        <Route path='/step2' render={ () => <StepTwo { ...this.props } /> } />
      </Switch>
    )
  }
}
```
Now StepOne and StepTwo will both be able to receive their needed Form props, such as `updateForm` and `addFormError`.
