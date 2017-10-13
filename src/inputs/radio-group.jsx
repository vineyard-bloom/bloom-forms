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
  let labelTextClasses = `input__label__text ${ labelClass ? labelClass : '' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }
  return (
    <radiogroup className={ containerClass }>
      { options.map((opt) => {
        let { label, id } = opt
        return (
          <label className='input__label input__label--radio input__label--inline' htmlFor={ name } onBlur={ props.onBlur }>
            <input type='radio' value={ value } name={ name } id={ id } onChange={ props.onChange }
              checked={ value === id } data-validate={ validateAs } { ...attr }
              className={ `input input--radio u-sr-only ${ className ? className : '' } ${ error ? 'input--invalid' : '' }` }
            />
            <div className={ `input--radio__placeholder non-sr-only ${ value === id ? 'is-checked' : '' }` }></div>
            <span className={ labelTextClasses }>
              { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
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