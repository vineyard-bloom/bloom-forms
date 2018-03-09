import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss'

class TextArea extends React.Component {
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
    const requiredProps = ['label', 'name']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps, true)
  }

  render() {
    let {
      className,
      containerClass,
      formData,
      error,
      isPassword,
      name,
      label,
      labelClass,
      placeholder,
      showLabel,
      suppressErrors,
      validateAs,
      value,
      ...props
    } = this.props
    let labelTextClasses = `Input-label-text ${labelClass ? labelClass : ''}${
      showLabel ? '' : ' u-sr-only'
    }`

    let attr = {}

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

    if (!props.onChange) {
      attr.readOnly = true
    }

    return (
      <label
        className={`Input-label ${containerClass || ''}`}
        htmlFor={name}
        id={`${name}-label`}
        onBlur={this.onFocusOut}
        onFocus={this.onFocusIn}
      >
        <span className={labelTextClasses}>
          {label}
          {attr.required && (
            <span>
              {'\u00A0'}*<span className='u-sr-only'> required field</span>
            </span>
          )}
        </span>
        <textarea
          style={{ minHeight: '100px', resize: 'none', width: '100%' }}
          data-validate={validateAs}
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={name}
          id={name}
          className={`Input Input--text ${className ? className : ''} ${
            error ? 'Input--invalid' : ''
          }`}
          {...attr}
        />
        {err && !suppressErrors ? <ErrorTip contents={err} /> : ''}
      </label>
    )
  }
}

TextArea.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  error: PropTypes.string,
  formData: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  labelClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  suppressErrors: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string
}

TextArea.defaultProps = {
  value: ''
}

export default TextArea
