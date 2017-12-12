import React from 'react';
import PropTypes from 'prop-types';

import '../styles/inputs.scss';
import '../styles/checkbox.scss';

const Checkbox = (props) => {
  let {
    checked, className, errors,
    name, label, labelClass,
    showLabel, showLabelBeforeCheckbox,
    validateAs, ...rest } = props;
  let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;
  let attr = {}

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  const labelText = (
    <span className={ labelTextClasses }>
      { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
    </span>
  )

  return (
    <label style={{paddingBottom: '2px'}} className='Input-label Input-label--inline Input--checkbox'
      id={ `${name}-label` }>
      { showLabelBeforeCheckbox && labelText }
      <div className={ `non-sr-only Input--checkbox-placeholder ${ checked ? 'glyphicon glyphicon-ok is-checked' : '' }` }></div>
      <input type='checkbox' checked={ checked } name={ name } id={ name } onChange={ props.onChange }
        className={ `u-sr-only Input Input--text ${ className ? className : '' } ${ errors ? 'Input--invalid' : '' }` }
        data-validate={ validateAs } { ...attr } />
      { !showLabelBeforeCheckbox && labelText }
      { errors &&
        <div className='Input-error'>{ errors }</div>
      }
    </label>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  errors: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
  labelClass: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showLabelBeforeCheckbox: PropTypes.bool,
  validateAs: PropTypes.string
};

export default Checkbox;
