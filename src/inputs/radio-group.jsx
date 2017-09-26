import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

// import './styles/inputs.scss'

const RadioGroup = (props) => {
  let {
    className, containerClass, error, isPassword,
    name, labelClass, options, placeholder, selectedVal,
    showLabel, validateAs, ...rest } = props;
  let labelTextClasses = `input__label__text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }
  return (
    <radiogroup className={ containerClass }>
      { options.map((opt) => {
        let { label, id, value } = opt
        return (
          <label className='input__label input__label--radio' htmlFor={ name } onBlur={ props.onBlur }>
            <span className={ labelTextClasses }>
              { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
            </span>
            <input type='radio' value={ value } name={ name } id={ id } onChange={ props.onChange }
              checked={ selectedVal === id } data-validate={ validateAs } { ...attr }
              className={ `input input--radio ${ className ? className : '' } ${ error ? 'input--invalid' : '' }` }
            />
            { error ? <ErrorTip contents={ error } /> : '' }
          </label>
        )
      }) }
    </radiogroup>
  )
}

TextInput.propTypes = {
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
      ]).isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  required: PropTypes.bool,
  selectedVal: PropTypes.string.isRequired,
  validateAs: PropTypes.string
};

export default RadioGroup;