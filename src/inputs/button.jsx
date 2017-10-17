import React from 'react'
import PropTypes from 'prop-types'

import Loading from './loading'

import '../styles/buttons.scss';

const Button = (props) => {
  let { className, contents, disabled, id, loading, loadingElement, onClick } = props;
  let classes = className && className.indexOf('Btn') > -1
    ? `o-flex-container ${className || ''}${ loading ? ' is-loading' : '' }`
    : `o-flex-container Btn ${className || ''}${ loading ? ' is-loading' : '' }`;
  return (
   <button className={ classes } onClick={ loading ? () => { return } : onClick } id={ id } disabled={ disabled || loading }>
      <span className='o-flex-container u-align-center'>
        { loading && (loadingElement || <Loading /> ) }
        { contents }
      </span>
   </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  contents: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingElement: PropTypes.element,
  onClick: PropTypes.func.isRequired
}

export default Button;