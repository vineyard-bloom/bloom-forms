# VALIDATORS

### The validator is completely customizable if you define a validationHelp object. It does however have a few 'validateAs' types built in. These are:

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
