'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import ErrorTip from '../error-tip'

import '../styles/inputs.scss'

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileText: 'Choose a File'
    }
  };

  static propTypes = {
    accept: PropTypes.string, /* file type */
    error: PropTypes.string,
    formId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
  };

  triggerInput = (e) => {
    const input = document.getElementById(this.props.id);
    if (e.target.getAttribute('type') === 'file') {
      return;
    }
    e.preventDefault();
    input.click();
  }

  updateText = (e) => {
    e.persist();
    const fileElem = document.getElementById(this.props.id);
    let fileNames = [...fileElem.files].map(file => file.name);
    this.setState({
      fileText: fileNames.join(', ')
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.props.formId, this.props.name, [...fileElem.files], 'file')
      }
    });

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  componentDidMount() {
    const requiredProps = ['formId', 'label', 'id', 'name', 'onChange']
    const recommendedProps = ['accept']

    const missingRequired = requiredProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    const missingRecommended = recommendedProps.filter(field => {
      return !this.props[field] && (this.props[field] !== false)
    })

    if (missingRequired.length) {
      console.log(`%c Missing required props in FileInput with name ${this.props.name}: ${missingRequired.toString()}`, 'color: red')
    }

    if (missingRecommended.length) {
      console.log(`%c Missing recommended props in FileInput with name ${this.props.name}: ${missingRecommended.toString()}`, 'color: red')
    }
  }

  render = () => {
    const { accept, error, id, label, multiple, name, required } = this.props
    let requiredString = ''
    let attr = {}

    if (required) {
      requiredString = (<span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span>)
      attr['required'] = true
      attr['aria-required'] = 'true'
    }

    return (
      <label htmlFor={ this.props.name } className='Input-label Input--file' onClick={ this.triggerInput }
        id={ `${ name }-label` }>
        <span className='Input--file-label-text'>{ label }{ requiredString }</span>
        <div className='Input-placeholder Input-placeholder--file' role='presentation' aria-hidden>
          <div className='Input--file-text'>
            { this.state.fileText }
          </div>
          <div className='Btn'>
            Browse <span className="u-sr-only">local file system</span>
          </div>
        </div>
        { error && <ErrorTip contents={ error } /> }
        <input name={ name } id={ id || name } { ...attr } type='file' data-validate={ required ? 'not-empty' : null }
          className='input u-sr-only' style={ {display: 'none'} } onChange={ this.updateText } accept={ accept }
          data-multiple-caption="{count} files selected" multiple={ multiple } data-validate='file'
        />
      </label>
    )
  }
}

export default FileInput
