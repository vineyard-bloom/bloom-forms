import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'

const TextArea = (props) => {
  let {
    className, error, isPassword,
    name, label, labelClass, placeholder,
    showLabel, validateAs, containerClass, ...rest } = props;
  let labelTextClasses = `input__label__text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  return (
    <label className={ `input__label ${ containerClass || '' }` } htmlFor={ name } onBlur={ props.onBlur }>
      <span className={ labelTextClasses }>
        { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
      </span>
      <textarea style={ {minHeight: '100px', resize: 'none', width: '100%'} } value={ value } data-validate={ validateAs }
        onChange={ props.onBlur } onBlur={ props.onChange } name={ name } id={ name }
        className={ `input input--text ${ className ? className : '' } ${ error ? 'input--invalid' : '' }` }
      />
      { error ? <ErrorTip contents={ error } /> : '' }
    </label>
  )
}

TextArea.propTypes = {
  className: PropTypes.string,
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
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string.isRequired
};

TextArea.defaultProps = {
  value: ''
}

export default TextArea;
