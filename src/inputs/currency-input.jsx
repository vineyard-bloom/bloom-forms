import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss'

class CurrencyInput extends React.Component {
  state = {
    focused: false
  };

  onFocusIn = e => {
    if (e) {
      e.preventDefault()
    }
    this.setState({
      focused: true
    })

    if (this.props.onFocus) {
      this.props.onFocus(this.props.formId, this.props.name)
    }
  };

  onFocusOut = e => {
    if (e) {
      e.preventDefault()
    }
    this.setState({
      focused: false
    })

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  };

  componentDidMount() {
    const requiredProps = ['id', 'label', 'minimumValue', 'name']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps, true)
  }

  render() {
    const {
      className,
      coinIcon,
      containerClass,
      currency,
      disabled,
      error,
      formData,
      id,
      label,
      labelClass,
      name,
      onBlur,
      onChange,
      placeholder,
      showLabel,
      suppressErrors,
      validateAs,
      value,
      ...props
    } = this.props
    const labelTextClasses = `Input-label-text ${
      labelClass ? labelClass : ''
    } ${showLabel ? '' : 'u-sr-only'}`

    const attr = {}

    if (props.required) {
      attr['aria-required'] = true
      attr.required = true
    }

    let err = error
    if (
      Object.keys(this.props).indexOf('value') === -1 &&
      formData &&
      Object.keys(formData).indexOf(name) > -1
    ) {
      attr.value = formData[name].value
      err = formData[name].error
    } else {
      attr.value = value
    }

    if (!onChange) {
      attr.readOnly = true
    }

    return (
      <label
        className={`Input-label ${containerClass || ''}`}
        id={`${id || name}-label`}
        onFocus={this.onFocusIn}
        onBlur={this.onFocusOut}
      >
        <span className={labelTextClasses}>
          <React.Fragment>{label}</React.Fragment>
          {attr.required && (
            <span key='required-helper-text'>
              {'\u00A0'}*<span className='u-sr-only'> required field </span>
            </span>
          )}
        </span>
        {coinIcon && (
          <div className='Input-before Input--currency-before'>{coinIcon}</div>
        )}
        <input
          type='number'
          className={`Input Input--currency ${className ? className : ''} ${
            error ? 'Input--invalid' : ''
          }`}
          data-validate={validateAs || 'number'}
          disabled={disabled}
          id={id || name}
          min={props.minimumValue}
          max={props.maximumValue}
          maxLength='150'
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          step='any'
          {...attr}
          value={attr.value.replace(/^0+(?!\.|$)/, '')}
        />
        {currency ? <div className='Input-after'>{currency}</div> : ''}
        {err && !this.state.focused && !suppressErrors ? (
          <ErrorTip contents={err} />
        ) : (
          ''
        )}
      </label>
    )
  }
}

CurrencyInput.defaultProps = {
  minimumValue: 0
}

CurrencyInput.propTypes = {
  className: PropTypes.string,
  coinIcon: PropTypes.element,
  containerClass: PropTypes.string,
  currency: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  formData: PropTypes.object,
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
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired
  ])
}

export default CurrencyInput
