# VALIDATORS

The validator is a fully-functional aggregator of every field passed in, returing any errors on those fields.

## Standard Usage with Bloom-Forms' Form wrapper:
1. Create a `validationHelp` object to pass into the Form wrapper:
```
import { Form } from 'bloom-forms'

  ...

  const validationHelp = {
    errorLanguage: {
      cat: 'This field should equal "cat."'
    },
    dictionary: {
      'cat': (testData) => testData === 'cat' ? null : validationHelp.errorLanguage.cat,
      'biggerThan2': (testData) => testData > 2 ? null : 'This field must be at least 2'
    }
  }

  ...

  render() {
    <Form fieldNames={ fieldNames }
      validationHelp={validationHelp}
      ...
    >
      <CatForm />
    </Form>
  }
```

2. Now, any of your bloom-inputs can use validateAs='cat', or any of the default validators defined below. If you want to use the Form wrapper with native inputs and still have it check with the validator, you need to set the attribute `data-validate` to whichever field in the dictionary you want it to correspond to.


## Usage without Form wrapper:
1. Create a dictionary of field / value pairs to the aggregator as `testDataObject`
```
// example testDataObject:
  {
    ownerName: { value: '', validateAs: 'not-empty', name: 'ownerName' },
    catName: { value: 'Mr Meow', validateAs: 'cat', name: 'catName' },
    ...
  }
```

2. Create an error language object from a localization file or json object of error messages
```
// example errorLanguage:
  {
    cat: 'This field should equal "cat."'
    'not-empty': 'Why\'d you leave this field empty?'
  }

```

3. Create an `dictionary` of `validateAs` keys with functions to process. If you want any validation that does not correspond to one of the default validators below, you will need this step. You can return an error message as a string, or refer to your previously-defined `errorLanguage`. For example:
```
// example dictionary
  {
    'cat': (testData) => testData === 'cat' ? null : errorLanguage.cat,
    'biggerThan2': (testData) => testData > 2 ? null : 'This field must be at least 2'
  }
```

4. And now use these three variables to pass into the aggregator:
```
import { validator } from 'bloom-forms'

...

const fieldStates = validator(testDataObject, errorLanguage, dictionary)

// ^ returns an object like:
// {
//  isValid: false,
//    warnings: {
//      catName: 'This field should equal "cat."',
//      ownerName: 'Why\'d you leave this field empty?'
//    }
//  }

```
or if the values don't result in errors,
```
{
  isValid: true,
  warnings: {}
}
```

## Triggering Validation
There are several methods available to trigger validation.
- By default, validation will trigger before submission.
```
// example submit button
  <Button
    onClick={props.submitForm}
  />
```

- You can also `checkField` on an individual input. Usually this is used `onBlur` on a specific input.
```
// example input that checks on blur (checkField is passed in by the Form wrapper automatically)
  <TextInput
    onBlur={props.checkField}
    validateAs='not-empty'
  />
```

- You can `checkMultipleFields`, which receives the id of the form and an array of field names to check. This can be triggered from anywhere, using the method from [formActions](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md#formactions).
```
import { formActions } from 'bloom-forms'

  ...

  // example button to trigger multiple checks
  <TextInput
    formData={props.formData}
    name='firstName'
    onBlur={props.checkField}
    validateAs='not-empty'
  />
  <TextInput
    formData={props.formData}
    name='lastName'
    onBlur={props.checkField}
    validateAs='not-empty'
  />
  <Button
    onClick={(e) => {e.preventDefault(); props.checkMultipleFields(props.formId, ['firstName', 'lastName'])}}
  />

  ...

const mapDispatchToProps = dispatch => ({
  checkMultipleFields: (id, fields) => dispatch(formActions.checkMultipleFields(id, fields))
})

export default connect(null, mapDispatchToProps)(ThisComponent)
```


## Default Validators
The validator is completely customizable if you define a `validationHelp` object. It does however have a few 'validateAs' types built in. You can override any of these with a custom definition in your `validationHelp` if you like. They are:

`date`:
  - validates a string as a valid Javascript Date

`email`:
  - validates a string as a valid email: string@string.domainEnding

`file`:
  - validates that a file's size doesn't exceed 10,000 bytes

`name`:
  - validates that the test data is a string and is at least 2 characters

`not-empty`:
  - validates that the test data is not null or an empty string
  - does not trigger on values of 0

`number`:
  - validates that the test data is a number or a string consisting entirely of numbers

`numberField`:
  - validates that the test data is a number, but displays a general error for the field name
  - useful in cases where a field has a value of a number but displays a string, for example, like country codes displaying country names

`phone`:
  - validates that the input is between 8 and 15 characters, one of the only worldwide universal standards of phone numbers

`zip`:
  - validates the test data against US zip codes
