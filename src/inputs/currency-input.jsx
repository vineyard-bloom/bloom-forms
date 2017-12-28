import React from 'react';
import PropTypes from 'prop-types';

import ErrorTip from '../error-tip'

import '../styles/inputs.scss';

class CurrencyInput extends React.Component {
  componentDidMount() {
    PropTypes.checkPropTypes(CurrencyInput.propTypes, props, 'prop', 'CurrencyInput');
    // for (let field in CurrencyInput.propTypes) {

    // }
  }

  render() {
    let {
      className, coinIcon, currency, disabled, error,
      id, label, labelClass, name, onBlur, onChange, placeholder,
      showLabel, validateAs, value, ...rest } = props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : 'u-sr-only' }`;

    let attr = {};

    if (rest.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    const labelElem = document.getElementById(`${id || name}-label`)

    return (
      <div>
        <label className='Input-label' id={ `${id || name}-label` }>
          <span className={ labelTextClasses }>
            { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
          </span>
          { coinIcon &&
            <div className='Input-before Input--currency-before'>{ coinIcon }</div>
          }
          <input type='number' min={ rest.minimumValue } step='any' value={ value.replace(/^0+(?!\.|$)/, '') } name={ name }
            id={ id || name } onChange={ onChange } onBlur={ onBlur } disabled={ disabled } max={ rest.maximumValue }
            className={ `Input Input--currency ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
            data-validate={ validateAs || 'number' } placeholder={ placeholder } maxLength='150' { ...attr } />
          { currency ?
            <div className='Input-after'>{ currency }</div>
            : '' }
        </label>
        { error ? <ErrorTip contents={ error } /> : '' }
      </div>
    )
  }
}

CurrencyInput.defaultProps = {
  minimumValue: 0
}

CurrencyInput.propTypes = {
  className: PropTypes.string,
  coinIcon: PropTypes.element,
  currency: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  maximumValue: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ]),
  minimumValue: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ]),
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
