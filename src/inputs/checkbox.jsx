import React from 'react';
import PropTypes from 'prop-types';

// import 'styles/components/inputs.scss';

const Checkbox = (props) => {
  let {
    checked, className, errors,
    name, label, labelClass, placeholder,
    showLabel, validateAs, ...rest } = props;
  let labelTextClasses = `input__label__text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;
  let attr = {}

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  return (
    <label style={{paddingBottom: '2px'}} className='input__label input__label--inline u-justify-center'>
      <div className={ `non-sr-only input--checkbox__placeholder ${ checked ? 'glyphicon glyphicon-ok is-checked' : '' }` }></div>
      <input type='checkbox' checked={ checked } name={ name } id={ name } onChange={ props.onChange }
        className={ `u-sr-only input input--text ${ className ? className : '' } ${ errors ? 'input--invalid' : '' }` }
        data-validate={ validateAs } { ...attr } />
      <span className={ labelTextClasses }>
        { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
      </span>
      { errors &&
        <div className='input__error'>{ errors }</div>
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
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string
};

export default Checkbox;
