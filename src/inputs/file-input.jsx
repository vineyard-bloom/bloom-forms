import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import { requiredPropsLogger } from '../required-props-logger'
import '../styles/inputs.scss'

class FileInput extends React.Component {
  state = {
    fileText: '',
    focused: false
  };

  static propTypes = {
    accept: PropTypes.string /* file type */,
    error: PropTypes.string,
    formId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    suppressErrors: PropTypes.bool
  };

  onFocusIn = e => {
    if (e) {
      e.preventDefault()
    }
    this.setState({
      focused: true
    })

    if (this.props.onFocus) {
      this.props.onFocus(this.props.formId, this.props.name)
    }
  };

  onFocusOut = e => {
    if (e) {
      e.preventDefault()
    }
    this.setState({
      focused: false
    })

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  };

  triggerInput = e => {
    const input = document.getElementById(this.props.id)
    if (e.target.getAttribute('type') === 'file') {
      return
    }
    e.preventDefault()
    input.click()
  };

  updateText = e => {
    e.persist()
    const fileElem = document.getElementById(this.props.id)
    let fileNames = [...fileElem.files].map(file => file.name)
    console.log('this.props.multiple', this.props.multiple)
    console.log(
      'this.state.fileText === fileNames',
      this.state.fileText === fileNames
    )

    if (!this.props.multiple && this.state.fileText === fileNames) {
      return
    }

    this.setState(
      {
        fileText: fileNames.join(', ')
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(
            this.props.formId,
            this.props.name,
            [...fileElem.files],
            'file',
            this.props.multiple
          )
        }
      }
    )

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  };

  componentDidMount() {
    const requiredProps = ['formId', 'label', 'id', 'name', 'onChange']
    const recommendedProps = ['accept']

    requiredPropsLogger(this.props, requiredProps, recommendedProps)
  }

  render = () => {
    const {
      accept,
      error,
      id,
      label,
      multiple,
      name,
      required,
      suppressErrors
    } = this.props
    let requiredString = ''
    let attr = {}

    if (required) {
      requiredString = (
        <span>
          {'\u00A0'}*<span className='u-sr-only'> required field</span>
        </span>
      )
      attr['required'] = true
      attr['aria-required'] = 'true'
    }

    return (
      <label
        htmlFor={this.props.name}
        className='Input-label Input--file'
        onClick={this.triggerInput}
        id={`${name}-label`}
        onFocus={this.onFocusIn}
        onBlur={this.onFocusOut}
      >
        <span className='Input--file-label-text'>
          {label}
          {requiredString}
        </span>
        <div className='Input-placeholder Input-placeholder--file' tabIndex={0}>
          <div className='Input--file-text'>{this.state.fileText}</div>
          <div className='Btn'>
            Browse <span className='u-sr-only'>local file system</span>
          </div>
        </div>
        {error &&
          !this.state.focused &&
          !suppressErrors && <ErrorTip contents={error} />}
        <input
          name={name}
          id={id || name}
          {...attr}
          type='file'
          data-validate={required ? 'not-empty' : null}
          className='input u-sr-only'
          style={{ display: 'none' }}
          onChange={this.updateText}
          accept={accept}
          data-multiple-caption='{count} files selected'
          multiple={multiple}
          data-validate='file'
          tabIndex={-1}
          aria-hidden
        />
      </label>
    )
  };
}

export default FileInput
