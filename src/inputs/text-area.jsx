import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'

class TextArea extends React.Component {
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
      console.log(`%c Missing required props in TextArea with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in TextArea with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: red')
    }
  }

  render() {
    let {
      className, error, isPassword,
      name, label, labelClass, placeholder,
      showLabel, validateAs, value, containerClass, ...props } = this.props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }${ showLabel ? '' : ' u-sr-only' }`;

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
        <textarea style={ {minHeight: '100px', resize: 'none', width: '100%'} } value={ value } data-validate={ validateAs }
          onChange={ props.onChange } onBlur={ props.onBlur } name={ name } id={ name }
          className={ `Input Input--text ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
          { ...attr }
        />
        { error ? <ErrorTip contents={ error } /> : '' }
      </label>
    )
  }
}

TextArea.propTypes = {
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
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string.isRequired
};

TextArea.defaultProps = {
  value: ''
}

export default TextArea;
