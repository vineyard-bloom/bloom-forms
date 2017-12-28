import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'

class TextInput extends React.Component {
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
      console.log(`%c Missing required props in TextInput with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in TextInput with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: red')
    }
  }

  render() {
    const {
      className, disabled, error, isPassword,
      name, label, labelClass, placeholder,
      showLabel, validateAs, containerClass, ...props } = this.props;
    const labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }${ showLabel ? '' : ' u-sr-only' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
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
        <input type={ isPassword ? 'password' : 'text' } value={ props.value } name={ name } id={ name }
          onChange={ props.onChange } onKeyDown={ props.onKeyDown } disabled={ disabled }
          className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          data-validate={ validateAs }  placeholder={ placeholder } maxLength='150' { ...attr }
          autoComplete='new-password'
        />
        { error ? <ErrorTip contents={ error } /> : '' }
      </label>
    )
  }
}

TextInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
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
  value: PropTypes.string.isRequired
};

TextInput.defaultProps = {
  value: ''
}

export default TextInput;
