# Props Given to Children
### What `<Form/>` passes to its contents

Whatever you stick inside of `<Form />` is wrapped in a variety of methods and props that are helpful to those children.

A complete list of these that are available via `this.props` are:
  - `addFormError`:
    A function that accepts the form id, the fieldName, and the error message.
    Used like
      ```
      this.props.addFormError('example-form', 'name', 'This field cannot be blank.');
      ```
  - `attemptedSubmit`:
    A boolean that indicates whether the user has already tried to submit the form. Useful in situations where you may want to run different checks depending on if they've submitted already or not.
  - `checkField`:
    A function that accepts a DOM event and an optional element if you don't want to use the DOM event target.
    Used like
    ```
    this.props.checkField(null, document.getElementById('example-field'))
    ```
    or
    ```
    this.props.checkField(e)
    ```
  - `deleteFormError`:
    A function that accepts the form id and the fieldName that has an error.
    Used like
    ```
    this.props.deleteFormError('example-form', 'name')
    ```
  - `formData`:
    An object that represents all the inputs inside your form. Corresponds to the object inside the redux store's `forms` object.
    An example formData object could look like:
      ```
        {
          'name': { value: 'Bob' },
          'phone': { value: '444-23', error: 'This field must be a valid phone number' }
        }
      ```
  - `formId`:
    The id of your Form. You should use this on your outermost
      ```
      <form id={this.props.formId}> ... </form>
      ```
  - `isValid`:
    A boolean that indicates whether all fields in your form have passed validation. Defaults to true.
  - `manualFieldUpdate`:
    See [Updating Form State](https://github.com/vineyard-bloom/bloom-forms#updating-form-state) above.
  - `prepopulated`:
    A boolean that indicates whether you've passed in saved data to populate the form.
  - `processingRequest`:
    A boolean indicating whether your form is submitting. Useful for loading animations and disabling buttons.
  - `updateForm`:
    See [Updating Form State](https://github.com/vineyard-bloom/bloom-forms#updating-form-state) above.
  - `submitForm`:
    An intermediary function that processes your form data before passing it along to your `submitForm` passed into `<Form />`.

[Back to Contents](https://github.com/vineyard-bloom/bloom-forms#readme-contents)
