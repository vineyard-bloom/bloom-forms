import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'
import '../styles/radio-input.scss'

class RadioGroup extends React.Component {
  componentDidMount() {
    const requiredProps = ['label', 'name', 'options', 'value']
    const recommendedProps = ['onChange']

    const missingRequired = requiredProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    const missingRecommended = recommendedProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    if (missingRequired.length) {
      console.log(`%c Missing required props in RadioGroup with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in RadioGroup with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: red')
    }
  }

  render() {
    let {
      className, containerClass, error,
      name, labelClass, legend, options, value,
      validateAs, ...props } = this.props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' }`;

    let attr = {};

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }
    return (
      <radiogroup className={ containerClass }>
        { legend && <legend className='Input-legend'>{ legend }</legend> }
        { options.map((opt,i) => {
          const { label, id } = opt
          const clickForward = (e) => {
            e.preventDefault();
            document.getElementById(id).click()
          }

          return (
            <label className='Input-label Input--radio-label Input-label--inline' htmlFor={ name } onBlur={ props.onBlur }
              onClick={ clickForward } id={ `${ name }-label` } key={ `radio-${name}-${id}` }>
              <input type='radio' value={ value } name={ name } id={ id } onChange={ props.onChange }
                checked={ value === id } data-validate={ validateAs } { ...attr }
                className={ `Input Input--radio u-sr-only ${ className ? className : '' } ${ error ? 'Input--invalid' : '' }` }
              />
              <div className={ `Input--radio-placeholder non-sr-only ${ value === id ? 'is-checked' : '' }` }></div>
              <span className={ labelTextClasses }>
                { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
              </span>
              { error ? <ErrorTip contents={ error } /> : '' }
            </label>
          )
        }) }
      </radiogroup>
    )
  }
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  error: PropTypes.string,
  labelClass: PropTypes.string,
  legend: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
      ]).isRequired
    })
  ).isRequired,
  required: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.string.isRequired
};

export default RadioGroup;