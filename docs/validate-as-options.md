# VALIDATORS

The validator is a fully-functional aggregator of every field passed in, returing any errors on those fields.

## Standard Usage with Bloom-Forms' Form wrapper:
1. Pass in a dictionary of field / value pairs to the aggregator as `testDataObject`
```
// example testDataObject:
  {
    [fieldName]: { value: fieldValue, validateAs: 'not-empty', name: fieldName},
    [fieldName]: { value: fieldValue, validateAs: 'phone', name: fieldName},
    ...
  }
```
2. Pass in error language from a localization file or json object of error messages

3. Pass in an `optDic` of `validateAs` keys with functions to process. For example:
```
/*
  {
    'cat': (testData) => testData === 'cat' ? null : 'This field should equal "cat."',
    'biggerThan2': (testData) => testData > 2 ? null : 'This field must be at least 2'
  }
*/
```
// and now you can use validateAs='cat' and validateAs='biggerThan2'


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
// returns an object like:
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


## Default Validators
The validator is completely customizable if you define a validationHelp object. It does however have a few 'validateAs' types built in. These are:

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
