# CHANGELOG

### Monday April 2, 2018
-- 1.4.0 publish
- processingRequest field in Redux set to false when component unmounts

-- 1.3.8 publish
- bug fix: SelectInput dropdowns not reopening when clicked if already focused

### Monday March 26, 2018
-- 1.3.7 publish
- FileInput can be clearable

-- 1.3.6 publish
- SelectInput non-typeahead button style fix (span is now display:flex inside button, instead of button flexed)
- onFocus for Select non-typeahead button on Safari fix

### Monday March 19, 2018 -- 1.3.3 publish
- SelectInput test fixes
- virtual-dom helper has root for Enzyme mounting attachment
- fix to ToggleSwitch's styling so parent divs are correct size

### Tuesday March 13, 2018
- fixing multiple validateAs fields in validator to fallback to previous error

### Monday March 12, 2018
- removing files from normal FileInput wipes file array for that element
- Dropzone accept helper text removed unneeded '$'
- SelectInput initial focus on regular (non-typeahead) input properly drops down on initial focus
- SelectInput choosing option properly closes dropdown options
- SelectInput focus on typeahead lost outline ring

### Friday March 9, 2018 -- 1.3.2 publish
- FileInput focus and 'enter' properly triggers file browser
- SelectInput drops down on initial focus
- All standard inputs have optional containerClass to wrap the entire div

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
