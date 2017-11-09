import React from 'react';
import PropTypes from 'prop-types';

import '../styles/inputs.scss';

const CurrencyInput = (props) => {
  let {
    className, currency, error,
    id, label, labelClass, name, onBlur, onChange, placeholder,
    showLabel, validateAs, value, ...rest } = props;
  let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : 'u-sr-only' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  const labelElem = document.getElementById(`${id}-label`)

  return (
    <div>
      <label className='Input-label' id={ `${id}-label` }>
        <span className={ labelTextClasses }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
        </span>
        <input type='number' min='0' step='any' value={ value } name={ name } id={ id } onChange={ onChange } onBlur={ onBlur }
          className={ `Input Input--currency ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          data-validate={ validateAs || 'number' } placeholder={ placeholder } maxLength='150' { ...attr } />
        { currency ?
          <div className='Input-after' style={ { right: '5px' } }>{ currency }</div>
          : '' }
      </label>
      { error ? <ErrorTip contents={ error } /> : '' }
    </div>
  )
}

CurrencyInput.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ])
};

export default CurrencyInput;
