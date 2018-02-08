import React from 'react'
import PropTypes from 'prop-types'

import { requiredPropsLogger } from '../required-props-logger'
import '../styles/dropzone'
import docImage from '../images/file.svg'
import ErrorTip from '../error-tip'

const docDrop = e => {
  e.preventDefault()
}

// simplified from react-dropzone
class MyDropzone extends React.Component {
  state = {
    loading: false
  };

  clearAll = e => {
    if (e) {
      e.preventDefault()
    }

    this.props.onChange(this.props.formId, this.props.name, [], 'file')
  };

  onDrop = e => {
    e.preventDefault()
    const items = this.getDataTransferItems(e)

    if (!this.state.loading) {
      this.setState({
        loading: true
      })
    }

    if (items[0] && items[0].name) {
      this.setState({
        loading: false
      })
    }

    if (items[0] && items[0].name && items[0].type) {
      this.props.onChange(this.props.formId, this.props.name, items, 'file')
    }
  };

  state = {
    focused: false
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

  getDataTransferItems(event) {
    let dataTransferItemsList = []
    if (event.dataTransfer) {
      const dt = event.dataTransfer
      if (dt.files && dt.files.length) {
        dataTransferItemsList = dt.files
      } else if (dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accesible via dataTransfer.items
        dataTransferItemsList = dt.items
      }
    } else if (event.target && event.target.files) {
      dataTransferItemsList = event.target.files
    }
    // Convert from DataTransferItemsList to the native Array
    return [...dataTransferItemsList]
  }

  triggerInput = e => {
    if (e.target.id === `dropzone-${name}-clear-btn`) {
      e.preventDefault()
      this.clearAll()
      return
    }
    let input = document.getElementById(this.props.name)
    if (e.target.getAttribute('type') === 'file') {
      return
    }
    e.preventDefault()
    input.click()
  };

  componentDidMount() {
    document.addEventListener('dragover', docDrop, false)
    document.addEventListener('drop', this.onDrop, false)

    const requiredProps = ['label', 'name', 'onChange']
    const recommendedProps = ['loadingElement', 'accept']

    requiredPropsLogger(this.props, requiredProps, recommendedProps)
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', docDrop)
    document.removeEventListener('drop', this.onDrop)
  }

  render() {
    const {
      accept,
      error,
      files,
      formData,
      imageStyle,
      label,
      loadingElement,
      multiple,
      name,
      required,
      suppressErrors,
      value
    } = this.props
    const dropZoneStyle = {
      border: '2px dashed #ddd',
      borderRadius: '5px',
      color: '#ddd',
      height: '310px',
      marginBottom: '0',
      marginTop: '2px',
      minHeight: '100px',
      overflow: 'hidden',
      padding: '20px',
      position: 'relative',
      width: '100%'
    }
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

    let err = error
    if (
      Object.keys(this.props).indexOf('value') === -1 &&
      formData &&
      Object.keys(formData).indexOf(name) > -1
    ) {
      attr.value = formData[name].value
      err = formData[name].error
    } else {
      attr.value = value
    }

    const defaultImageStyle = {
      height: 'auto',
      margin: '0 auto',
      maxHeight: '150px',
      maxWidth: '200px',
      minHeight: '100px',
      minWidth: '100px',
      objectFit: 'contain',
      overflow: 'hidden',
      width: `${1 / (files.length || 1) * 100}%`
    }

    const imagePreview =
      files && files[0]
        ? files.map((item, i) => {
            if (item.type && item.type.includes('image')) {
              let src = URL.createObjectURL(item)
              return (
                <li
                  key={`preview-image-${name}-${i}`}
                  className={`DropZone-preview DropZone-upload-file DropZone-upload-file--${
                    item.type
                  }`}
                  style={{
                    maxWidth: defaultImageStyle.width,
                    minWidth: '150px'
                  }}
                >
                  <img
                    className='DropZone-upload-img'
                    src={src}
                    role='presentation'
                    aria-hidden
                    style={imageStyle || defaultImageStyle}
                    alt={item.name}
                  />
                  <span className='DropZone-upload-name'>{item.name}</span>
                </li>
              )
            } else {
              return (
                <li
                  className={`DropZone-preview DropZone-upload-file DropZone-upload-file--${
                    item.type
                  }`}
                  key={`preview-image-${name}-${i}`}
                  style={{ maxWidth: defaultImageStyle.width }}
                >
                  <img
                    role='presentation'
                    aria-hidden
                    style={imageStyle || defaultImageStyle}
                    src={docImage}
                  />
                  <span className='DropZone-upload-name'>{item.name}</span>
                </li>
              )
            }
          })
        : null

    return (
      <label
        className='Input-label DropZone'
        onFocus={this.onFocusIn}
        onBlur={this.onFocusOut}
      >
        {label}
        {requiredString}
        <div
          onDragOver={this.onDrop}
          multiple={false}
          onClick={this.triggerInput}
          style={dropZoneStyle}
          className='DropZone-box Input--file'
        >
          <div aria-hidden role='presentation'>
            {imagePreview ? (
              <ul className='DropZone-preview-container'>{imagePreview}</ul>
            ) : (
              <span>
                <p className='u-text-center'>
                  Drag image or click here to select
                  {this.state.loading &&
                    (loadingElement ? loadingElement : 'Loading...')}
                </p>
                {accept && (
                  <p className='u-text-center'>
                    Only ${accept} type files accepted.
                  </p>
                )}
              </span>
            )}
          </div>
          <input
            type='file'
            className='u-sr-only'
            id={name}
            onChange={this.onDrop}
            multiple={multiple}
            accept={accept}
          />
        </div>
        <button
          className='Btn'
          id={`dropzone-${name}-clear-btn`}
          onClick={this.clearAll}
        >
          Clear All
        </button>
        {err && !this.state.focused && !suppressErrors ? (
          <ErrorTip contents={err} />
        ) : (
          ''
        )}
      </label>
    )
  }
}

MyDropzone.propTypes = {
  accept: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.object),
  imageStyle: PropTypes.object,
  label: PropTypes.string.isRequired,
  loadingElement: PropTypes.element,
  name: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  suppressErrors: PropTypes.bool
}

MyDropzone.defaultProps = {
  files: [],
  multiple: true
}

export default MyDropzone
