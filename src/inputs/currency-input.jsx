import React from 'react';
import PropTypes from 'prop-types';

import ErrorTip from '../error-tip'

import '../styles/inputs.scss';

class CurrencyInput extends React.Component {
  componentDidMount() {
    const requiredProps = ['id', 'label', 'maximumValue', 'name', 'value']
    const recommendedProps = ['onChange']

    const missingRequired = requiredProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    const missingRecommended = recommendedProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    if (missingRequired.length) {
      console.log(`%c Missing required props in CurrencyInput with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in CurrencyInput with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: orange')
    }
  }

  render() {
    let {
      className, coinIcon, currency, disabled, error,
      id, label, labelClass, name, onBlur, onChange, placeholder,
      showLabel, validateAs, value, ...props } = this.props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : 'u-sr-only' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    if (!onChange) {
      attr.readOnly = true
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
          <input type='number'
            className={ `Input Input--currency ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
            data-validate={ validateAs || 'number' } disabled={ disabled } 
            id={ id || name } 
            min={ props.minimumValue } max={ props.maximumValue } maxLength='150'
            name={ name }
            onChange={ onChange } onBlur={ onBlur }
            placeholder={ placeholder } step='any'
            value={ (value || '').replace(/^0+(?!\.|$)/, '') }
            { ...attr }
          />
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
