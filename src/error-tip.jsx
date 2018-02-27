import React from 'react'
import PropTypes from 'prop-types'

import './styles/error-tip.scss'

const ErrorTip = props => {
  return (
    <div
      className={`ErrorTip ErrorTip ${props.className || ''}`}
      aria-live='assertive'
      role='alert'
    >
      <div
        className={`ErrorTip--contents ErrorTip--contents--${props.direction}`}
      >
        <div className='ErrorTip--contents-text'>{props.contents}</div>
      </div>
    </div>
  )
}

ErrorTip.defaultProps = {
  direction: 'top'
}

ErrorTip.propTypes = {
  className: PropTypes.string,
  contents: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  direction: PropTypes.string.isRequired
}

export default ErrorTip
