# COMPARING BLOOM-FORMS TO OTHER FORM LIBRARIES

Bloom-Forms uses several paradigms that are part of the general React ecosystem.

## HOCs
Higher Order Components (HOCs) are frequently used to wrap child components with needed props to allow for less code repetition. These are components that can receive any `children` as props and pass in different methods and properties to those children by cloning them and adding to their props.

Redux-form uses a `reduxForm()` wrapper to connect your components to a specific form.

Bloom-Forms uses the [`<Form/>`](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md) component wrapper to connect any of your children to that form.

** Why Bloom-Forms?
The [`<Form/>` Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md) is more configurable, has more features out of the box, and it only needs to be rendered once. `withForm()` must wrap around every child component, which can get repetitive with wizard forms.

Additionally, [`<Form/>` Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md) needs to be told which field names to pay attention to in only one place. Versus `withForm()`, which requires that you use a special `<Field>` component provided by the Redux-form package to wrap every single input that you want it to pay attention to.

## Use with Redux
Redux is generally needed for state that's used throughout your application by multiple components. Most forms are a singular component, or one parent component with several child components inside (i.e. wizard forms). So why do so many form libraries use Redux to control your form state?

1. Tracking form state can be extremely repetitive code-wise. It makes sense to abstract out this state functionality into one place so that implementation can be reused and improved upon everywhere.

2. Moving the state to Redux allows other sections of the app to respond to your form. For example, if you have an Accordion holding sections of a form, the Accordion can more easily grab whether that form has errors or `isValid` if those properties are available through Redux. Then, it could use these properties to render checkmarks for Accordion sections that are complete for good UX.

3. Support around state changes in Redux, particularly with the Redux Dev Tools, allows for easier debugging. Having actions tracked and logged so that it's easier to watch the order of form changes can be very helpful.

Formsy-React chooses to use decorators / HOCs to hold onto your form state, but retrieving that state and tracking its inner workings can be more difficult.

## Validation

Bloom-Forms comes with a very flexible validation system, allowing validation through the [`<Form/>` Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md) and through the [validator](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/validate-as-options.md) directly. It's completely functional.

Bloom-Forms takes a similar approach to both Formsy-React and Redux-Forms in that passing in custom validation is relatively straight-forward:

### Bloom-Forms / Bloom-Inputs:
Define / import the validator functions and pass them into your Form wrapper. Then use `validateAs` on any of the fields inside.
#### Advantages:
Validator functions can be passed in once and used on any children with the corresponding `validateAs` (Bloom-Inputs) or `data-validate` (your custom inputs). Validators are vanilla JS. Error messages can be defined right in your validator function.
#### Disadvantages:


### Formsy-React:
Use the `addValidationRule` method available through Formsy-React to define your new validator function. Pass in both a `validation` prop to tie your input to your custom validation rule and a `validationError` prop to render when the input is invalid.
#### Advantages:
Any children of the form can use the `validation` rules you've defined without importing or passing down more than once.
#### Disadvantages:
Validator functions have to be defined using Formsy-React's `addValidationRule` method. Error messages have to be defined on each input.

### Redux-Form:
Define / import the validator function on the same page as your `<Field>` is rendered. Pass it into Redux-Form's `<Field>` as the `validate` prop.
#### Advantages:
Validators are vanilla JS. Error messages are defined right in your validator function.
#### Disadvantages:
You must use Redux-Form's `<Field>` to tie to validators.
