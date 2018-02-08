import React from 'react'
import PropTypes from 'prop-types'

import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss'
import '../styles/toggle-switch.scss'

class ToggleSwitch extends React.Component {
  componentDidMount() {
    const requiredProps = ['isActive', 'labelText', 'name', 'onClick']

    requiredPropsLogger(this.props, requiredProps)
  }

  render() {
    let {
      className,
      disabled,
      formData,
      innerLabels,
      isActive,
      labelText,
      name,
      onClick,
      required,
      showLabel,
      onFocus,
      ...props
    } = this.props
    let attr = {}

    if (required) {
      attr['required'] = true
      attr['aria-required'] = true
    }

    const triggerHiddenCheckbox = e => {
      e.preventDefault()
      document.getElementById(name).click()
    }

    if (
      Object.keys(this.props).indexOf('isActive') === -1 &&
      (formData && Object.keys(formData).indexOf(name) > -1)
    ) {
      attr.checked = formData[name].value
    } else {
      attr.checked = isActive
    }

    if (!props.onChange) {
      attr.readOnly = true
    }

    return (
      <label
        className={`ToggleSwitch ${isActive ? 'active' : ''} ${
          disabled ? 'disabled' : ''
        }
        ${className || ''}`}
        onClick={!disabled ? triggerHiddenCheckbox : () => ''}
        id={`${name}-label`}
      >
        <span
          className={`ToggleSwitch-label-text ${showLabel ? '' : 'u-sr-only'}`}
        >
          {labelText}
          {attr.required && (
            <span>
              {'\u00A0'}*<span className='u-sr-only'> required field</span>
            </span>
          )}
        </span>
        <input
          type='checkbox'
          className='ToggleSwitch-input u-sr-only'
          checked={isActive}
          id={name}
          name={name}
          aria-labelledby={`${name}-aria-label`}
          onClick={onClick}
          readOnly
          aria-live='polite'
        />
        <span
          className='u-sr-only'
          id={`${name}-aria-label`}
          aria-live='polite'
        >
          {labelText}: {isActive ? 'on' : 'off'}.
          <span className='u-sr-only'>
            Press Space Bar to toggle on or off.
          </span>
        </span>
        <div>
          <span
            className='ToggleSwitch-label'
            data-on={(innerLabels && innerLabels.on) || 'On'}
            data-off={(innerLabels && innerLabels.off) || 'Off'}
          >
            {innerLabels &&
              innerLabels.on &&
              innerLabels.off && (
                <span
                  className='ToggleSwitch-label-text'
                  aria-hidden
                  role='presentation'
                >
                  {isActive ? innerLabels.on : innerLabels.off}
                </span>
              )}
          </span>
          <span
            role='presentation'
            aria-hidden
            className={`ToggleSwitch-handle ${isActive ? 'active' : ''}`}
          />
        </div>
      </label>
    )
  }
}

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  formData: PropTypes.object,
  innerLabels: PropTypes.shape({
    on: PropTypes.string.isRequired,
    off: PropTypes.string.isRequired
  }),
  isActive: PropTypes.bool.isRequired,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  required: PropTypes.bool,
  showLabel: PropTypes.bool
}

export default ToggleSwitch
