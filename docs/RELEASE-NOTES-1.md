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