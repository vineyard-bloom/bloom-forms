# Bloom Forms Inputs

## Contents:
  * [Button](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#button)
  * [Checkbox](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#checkbox)
  * [CurrencyInput](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#currencyinput)
  * [Dropzone](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#dropzone)
  * [FileInput](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#fileinput)
  * [RadioGroup](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#radiogroup)
  * [RangeInput](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#rangeinput)
  * [SelectInput](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#selectinput)
  * [TextArea](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#textarea) (bigger, multi-line, like `<textarea>`)
  * [TextInput](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#textinput)
  * [ToggleSwitch](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md#toggleswitch)


## Button
### Required Props
- `id`:
  A unique string to give the Button an ID. Especially important if the `Button` triggers a modal or other elements where it's needed for accessibility.
- `onClick`:
  A function to be triggered when the `Button` is clicked.
- `text`:
  A string; displays on the inside of the `Button`.

### Optional Props
- `className`:
  A string to style the `Button`.
- `loading`:
  A boolean indicating if something on the page is loading that should prevent `Button` click events.
- `loadingElement`:
  A React Element containing a spinner or other loading indicator in case you don't want to use the bloom-forms default spinner.


## Checkbox
### Required Props
- `checked`:
  A boolean for if the element is checked or not. Usually populated like `formData.field.value`.
- `name`:
  A string that should match one of the string in `fieldNames` passed into `<Form>`. Also used as the checkbox's ID.
- `label`:
  Either a string or an element to label the checkbox. Hidden by default, but always required for accessibility purposes.
- `onChange`:
  A function that fires when the checkbox is clicked. Usually `updateForm`.

### Optional Props
- `className`:
  A string for styling the checkbox input.
- `errors`:
  A string for displaying errors. Usually populated like `formData.field.error`.
- `labelClass`:
  A string for styling the label text.
- `onBlur`:
  A function that fires when the `Checkbox` loses focus. Usually fires validation via `checkField`.
- `required`:
  A boolean indicating if the input value can't be empty.
- `showLabel`:
  A boolean showing or hiding the label text. By default, all bloom forms input labels are hidden.
- `validateAs`:
  A string tying into the validation help passed in to the wrapper `<Form>`. Example include 'not-empty', 'zip', and 'number'.


## CurrencyInput
### Required Props

### Optional Props


## Dropzone
### Required Props

### Optional Props


## FileInput
### Required Props

### Optional Props


## RadioGroup
### Required Props
- `name`:
  A string tying the `RadioGroup`'s value to the `formData`. Also sets the `name` prop of each element in the group.
- `onChange`:
  A function used to update the `RadioGroup`'s value. Generally, this should be `updateForm`.
- `options`:
  An array of radio options, with each one looking like:
  ```
  {
    id: string,
    label: either a strig or a react element
  }
  ```
- `value`:
  A string mapped to the `RadioGroup`'s value in `formData`.

### Optional Props
- `className`:
  A string to style each radio input.
- `containerClass`:
  A string to style the entire component wrapper.
- `error`:
  A string usually passed in directly from `formData` that notes an error with that field validation. Generally passed in like `formData.field.error`.
- `labelClass`:
  A string that styles only the label text of each radio input.
- `onBlur`:
  A function that fires when focus leaves the element. Usually used to `checkField`.
- `required`:
  A boolean indicating if the input value can't be empty.
- `validateAs`:
  A string tying into the validation help passed in to the wrapper `<Form>`. Example include 'not-empty', 'zip', and 'number'.


## RangeInput
### Required Props

### Optional Props


## SelectInput
### Required Props
- `formId`:
  A string that matches the id passed into your wrapper `<Form>`.
- `label`:
  A string labelling your select input. Required for accessibility purposes, but hidden by default.
- `name`:
  A string tying the `formData` to the input's value. It should match one of the strings in `fieldNames` array passed into `<Form>`.
- `onChange`:
  A function used to update the `SelectInput`'s value. Generally, this should be `manualFieldUpdate`.
- `options`:
  An array of either strings, or an object of type: { label: string, value: number or string }. These populate your `SelectInput` options.
- `value`:
  Either a number or string holding the value of the `SelectInput`. Generally passed in like `formData.field.value`.

### Optional Props
- `containerClass`:
  A string to style the entire select input container. Shows up on `<label>` in the DOM.
- `error`:
  A string usually passed in directly from `formData` that notes an error with that field validation. Generally passed in like `formData.field.error`.
- `loading`:
  A boolean indicating if an ajax request is populating the options of your SelectInput.
- `onBlur`:
  A function that fires when focus leaves the element. Usually used to `checkField`.
- `required`:
  A boolean indicating if the input value can't be empty.
- `showLabel`:
  A boolean showing or hiding the label text. By default, all bloom forms input labels are hidden.
- `typeAhead`:
  A boolean indicating if the `SelectInput` should have typeahead functionality. If set to false, typing letter characters has no effect on results.
- `validateAs`:
  A string tying into the validation help passed in to the wrapper `<Form>`. Example include 'not-empty', 'zip', and 'number'.

## TextArea
### Required Props

### Optional Props


## TextInput
### Required Props

### Optional Props


## ToggleSwitch
### Required Props

### Optional Props

