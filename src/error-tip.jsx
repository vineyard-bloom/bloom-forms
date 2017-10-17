import React from 'react'
import PropTypes from 'prop-types'

import './styles/error-tip.scss'

const ErrorTip = (props) => {
  return (
    <div className={ `Tooltip Tooltip--error ${ props.className || '' }` } aria-live='polite'>
      <div className={ `Tooltip-contents Tooltip-contents--${ props.direction }` }>
        <div className='Tooltip-contents-text'>{ props.contents }</div>
      </div>
    </div>
  )
}

ErrorTip.defaultProps = {
  direction: 'top'
}

ErrorTip.propTypes = {
  className: PropTypes.string,
  contents: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  direction: PropTypes.string.isRequired
}

export default ErrorTip
