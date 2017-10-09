import React from 'react'
import PropTypes from 'prop-types'

import Loading from './loading'

import '../styles/buttons.scss';

const Button = (props) => {
  let { className, disabled, id, loading, loadingElement, onClick, text } = props;
  let classes = className && className.indexOf('btn') > -1
    ? `o-flex-container ${className || ''}${ loading ? ' is-loading' : '' }`
    : `o-flex-container btn ${className || ''}${ loading ? ' is-loading' : '' }`;
  return (
   <button className={ classes } onClick={ loading ? () => { return } : onClick } id={ id } disabled={ disabled || loading }>
      <span className='o-flex-container u-align-center'>
        { loading && (loadingElement || <Loading /> ) }
        { text }
      </span>
   </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingElement: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}

export default Button;