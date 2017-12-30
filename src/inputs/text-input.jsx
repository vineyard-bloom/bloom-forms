import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss'

class TextInput extends React.Component {
  componentDidMount() {
    const requiredProps = ['label', 'name']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps, true)
  }

  render() {
    const {
      className, containerClass, disabled, error, formData, isPassword,
      name, label, labelClass, placeholder,
      showLabel, validateAs, value, ...props } = this.props;
    const labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }${ showLabel ? '' : ' u-sr-only' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    let err = error
    if (Object.keys(this.props).indexOf('value') === -1 && formData && (Object.keys(formData).indexOf(name) > -1)) {
      attr.value = formData[name].value
      err = formData[name].error
    } else {
      attr.value = value
    }

    if (!props.onChange) {
      attr.readOnly = true
    }

    return (
      <label className={ `Input-label ${ containerClass || '' }` } htmlFor={ name } onBlur={ props.onBlur }
        id={ `${ name }-label` }>
        <span className={ labelTextClasses }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
        </span>
        <input type={ isPassword ? 'password' : 'text' } name={ name } id={ name }
          onChange={ props.onChange } onKeyDown={ props.onKeyDown } disabled={ disabled }
          className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          data-validate={ validateAs }  placeholder={ placeholder } maxLength='150' { ...attr }
          autoComplete='new-password'
        />
        { err ? <ErrorTip contents={ err } /> : '' }
      </label>
    )
  }
}

TextInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  formData: PropTypes.object,
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
  value: PropTypes.string
};

TextInput.defaultProps = {
  value: ''
}

export default TextInput;
