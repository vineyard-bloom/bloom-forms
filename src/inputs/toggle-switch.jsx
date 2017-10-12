import React from 'react';
import PropTypes from 'prop-types';

import '../styles/inputs.scss';
import '../styles/toggle-switch.scss';

const ToggleSwitch = (props) => {
  let { className, disabled, innerLabels, isActive, labelText, name, onClick, required } = props;

  let attr = {};

  if (required) {
    attr['required'] = true;
    attr['aria-required'] = true;
  }

  return (
    <label className={ `toggle-switch ${ isActive ? 'active' : '' } ${ disabled ? 'disabled' : '' }
      ${ className || '' }` } onClick={ !disabled ? onClick : () => '' }>
      { labelText }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
      <input type='checkbox' className='toggle-switch-input u-sr-only' checked={ isActive } id={ name } name={ name } />
      <div>
        <span className='u-sr-only'>{ isActive ? 'on' : 'off' }</span>
        <span className='toggle-switch-label' data-on={ innerLabels && innerLabels.on || 'On' }
          data-off={ innerLabels && innerLabels.off || 'Off' }>
          { innerLabels && innerLabels.on && innerLabels.off &&
            <span className='toggle-switch-label__text'>
              { isActive ? innerLabels.on : innerLabels.off }
            </span>
          }
        </span>
        <span role='presentation' aria-hidden className={ `toggle-switch-handle ${ isActive ? 'active' : '' }` }></span>
      </div>
    </label>
  )
}

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  innerLabels: PropTypes.shape({
    on: PropTypes.string.isRequired,
    off: PropTypes.string.isRequired
  }),
  isActive: PropTypes.bool.isRequired,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  required: PropTypes.bool
}

export default ToggleSwitch;
