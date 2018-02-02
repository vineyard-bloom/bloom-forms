import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import { requiredPropsLogger } from '../required-props-logger'

/* just the basic input[type='date'] -- no customized dropdown styles or anything */
class DateInput extends React.Component {
  state = {
    focused: false
  }

  onFocusIn = (e) => {
    if (e) { e.preventDefault(); }
    this.setState({
      focused: true
    })

    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  onFocusOut = (e) => {
    if (e) { e.preventDefault(); }
    this.setState({
      focused: false
    })

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  componentDidMount() {
    const requiredProps = ['label', 'name']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps, true)
  }

  render() {
    const {
      className, containerClass, error, formData,
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
      <label className={ `Input-label ${ containerClass || '' }` } htmlFor={ name } onBlur={ this.onFocusOut }
        id={ `${ name }-label` } onFocus={ this.onFocusIn }>
        <span className={ labelTextClasses }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
        </span>
        <input
          className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          data-validate={ validateAs }
          id={ name } name={ name }
          onChange={ props.onChange } onKeyDown={ props.onKeyDown }
          placeholder={ placeholder } type='date'
          { ...attr }
        />
        { err && !this.state.focused ? <ErrorTip contents={ err } /> : '' }
      </label>
    )
  }
}

DateInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  formData: PropTypes.object,
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
  value: PropTypes.string.isRequired
};

DateInput.defaultProps = {
  value: ''
}

export default DateInput
