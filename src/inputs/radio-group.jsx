import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss'
import '../styles/radio-input.scss'

class RadioGroup extends React.Component {
  componentDidMount() {
    const requiredProps = ['name', 'options']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps, true)
  }

  render() {
    let {
      className, containerClass, error, formData,
      name, labelClass, legend, options, value,
      validateAs, ...props } = this.props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    let err = error
    if (Object.keys(this.props).indexOf('error') === -1 && formData && (Object.keys(formData).indexOf(name) > -1)) {
      err = formData[name].error
    }

    return (
      <fieldset className={ containerClass }>
        { legend && <legend className='Input-legend'>{ legend }</legend> }
        { options.map((opt,i) => {
          const { label, id } = opt
          const clickForward = (e) => {
            e.preventDefault();
            document.getElementById(id).click()
          }

          if (Object.keys(this.props).indexOf('value') === -1 && formData && (Object.keys(formData).indexOf(name) > -1)) {
            attr.value = formData[name].value
            attr.checked = formData[name].value === id
          } else {
            attr.value = value
            attr.checked = value === id
          }

          return (
            <label className='Input-label Input--radio-label Input-label--inline' htmlFor={ name } onBlur={ props.onBlur }
              onClick={ clickForward } id={ `${ name }-label` } key={ `radio-${name}-${id}` }>
              <input
                className={ `Input Input--radio u-sr-only ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
                data-validate={ validateAs }
                id={ id } name={ name }
                onChange={ props.onChange }
                type='radio' { ...attr }
              />
              <div className={ `Input--radio-placeholder non-sr-only ${ value === id ? 'is-checked' : '' }` }></div>
              <span className={ labelTextClasses }>
                { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
              </span>
            </label>
          )
        }) }
        { err ? <ErrorTip contents={ err } /> : '' }
      </fieldset>
    )
  }
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  error: PropTypes.string,
  formData: PropTypes.object,
  labelClass: PropTypes.string,
  legend: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
      ]).isRequired
    })
  ).isRequired,
  required: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string
};

export default RadioGroup;