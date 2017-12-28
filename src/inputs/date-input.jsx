import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

/* just the basic input[type='date'] -- no customized dropdown styles or anything */
class DateInput extends React.Component {
  componentDidMount() {
    const requiredProps = ['label', 'name', 'value']
    const recommendedProps = ['onChange']

    const missingRequired = requiredProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    const missingRecommended = recommendedProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    if (missingRequired.length) {
      console.log(`%c Missing required props in DateInput with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in DateInput with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: red')
    }
  }

  render() {
    const {
      className, error,
      name, label, labelClass, placeholder,
      showLabel, validateAs, containerClass, ...props } = this.props;
    const labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }${ showLabel ? '' : ' u-sr-only' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    return (
      <label className={ `Input-label ${ containerClass || '' }` } htmlFor={ name } onBlur={ props.onBlur }
        id={ `${ name }-label` }>
        <span className={ labelTextClasses }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
        </span>
        <input type='date' value={ props.value } name={ name } id={ name }
          onChange={ props.onChange } onKeyDown={ props.onKeyDown }
          className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          data-validate={ validateAs }  placeholder={ placeholder } { ...attr } />
        { error ? <ErrorTip contents={ error } /> : '' }
      </label>
    )
  }
}

DateInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
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
