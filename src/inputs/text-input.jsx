import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'

const TextInput = (props) => {
  const {
    className, disabled, error, isPassword,
    name, label, labelClass, placeholder,
    showLabel, validateAs, containerClass, ...rest } = props;
  const labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }${ showLabel ? '' : ' u-sr-only' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  return (
    <label className={ `Input-label ${ containerClass || '' }` } htmlFor={ name } onBlur={ props.onBlur }
      id={ `${ name }-label` }>
      <span className={ labelTextClasses }>
        { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
      </span>
      <input type={ isPassword ? 'password' : 'text' } value={ props.value } name={ name } id={ name }
        onChange={ props.onChange } onKeyDown={ props.onKeyDown } disabled={ disabled }
        className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
        data-validate={ validateAs }  placeholder={ placeholder } maxLength='150' { ...attr }
        autocomplete='new-password'
      />
      { error ? <ErrorTip contents={ error } /> : '' }
    </label>
  )
}

TextInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  isPassword: PropTypes.bool,
  label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
  labelClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string.isRequired
};

TextInput.defaultProps = {
  value: ''
}

export default TextInput;
