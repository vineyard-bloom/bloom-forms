# CHANGELOG

### Tues March 7, 2018 -- 1.3.0 & 1.3.1 publish
- add processingRequest to redux so that it is easier to access.

### Tues March 6, 2018 -- 1.2.1 publish
- fix to form submission bug that looked for field.value on processed form object

### Mon March 5, 2018 -- 1.2.0 publish
- refactor form.jsx to be cleaner, easier to read
- moving form formatting into its own method, `processFormDataForSubmit`
- making formReducer immutable
- cleaning up formTest
- option to `wrapInFormElement` and have form.jsx render `<form></form>` for you
