import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'
import '../styles/radio-input.scss'

const RadioGroup = (props) => {
  let {
    className, containerClass, error,
    name, labelClass, options, value,
    validateAs, ...rest } = props;
  let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }
  return (
    <radiogroup className={ containerClass }>
      { options.map((opt) => {
        const { label, id } = opt
        const clickForward = (e) => {
          e.preventDefault();
          document.getElementById(id).click()
        }

        return (
          <label className='Input-label Input--radio-label Input-label--inline' htmlFor={ name } onBlur={ props.onBlur }
            onClick={ clickForward }>
            <input type='radio' value={ value } name={ name } id={ id } onChange={ props.onChange }
              checked={ value === id } data-validate={ validateAs } { ...attr }
              className={ `Input Input--radio u-sr-only ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
            />
            <div className={ `Input--radio-placeholder non-sr-only ${ value === id ? 'is-checked' : '' }` }></div>
            <span className={ labelTextClasses }>
              { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
            </span>
            { error ? <ErrorTip contents={ error } /> : '' }
          </label>
        )
      }) }
    </radiogroup>
  )
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  error: PropTypes.string,
  labelClass: PropTypes.string,
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
  value: PropTypes.string.isRequired
};

export default RadioGroup;