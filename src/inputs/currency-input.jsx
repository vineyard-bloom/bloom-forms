import React from 'react';
import PropTypes from 'prop-types';

import '../styles/inputs.scss';

const CurrencyInput = (props) => {
  let {
    className, currency, error,
    id, label, labelClass, name, onBlur, onChange, placeholder,
    showLabel, validateAs, value, ...rest } = props;
  let labelTextClasses = `input__label__text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;

  let attr = {};

  if (rest.required) {
    attr['aria-required'] = true;
    attr.required = true;
  }

  const labelElem = document.getElementById(`${id}__label`)

  return (
    <div>
      <label className='input__label' id={ `${id}__label` }>
        <span className={ labelTextClasses }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
        </span>
        <input type='number' min='0' step='any' value={ value } name={ name } id={ id } onChange={ onChange } onBlur={ onBlur }
          className={ `input input--currency ${ className ? className : '' } ${ error ? 'input--invalid' : '' }` }
          data-validate='number' placeholder={ placeholder } { ...attr } />
        { currency ?
          <div className='input__after' style={ { right: '5px', marginTop: '25px' } }>{ currency }</div>
          : '' }
      </label>
      { error ? <ErrorTip contents={ error } /> : '' }
    </div>
  )
}

CurrencyInput.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.string,
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
  value: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ])
};

export default CurrencyInput;
