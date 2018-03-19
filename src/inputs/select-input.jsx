import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'
import Loading from './loading'
import { requiredPropsLogger } from '../required-props-logger'
import '../styles/inputs.scss'
import '../styles/select-input.scss'

/* SUPPORTS:
  - typeahead
  - esc and arrow keys
  - tabbing
  - regular old onClick
  - multiple values
*/

const compareLetters = (str1, str2) => {
  // finding out if the first part of comparison string (str2) matches the typeahead (str1)
  return str1
    ? str2
        .toLowerCase()
        .slice(0, str1.length)
        .split('')
        .reduce(
          (total, curr, index) => total && curr === str1.toLowerCase()[index]
        )
    : true
}

class SelectInput extends React.Component {
  state = {
    focused: false,
    focusedOption: null,
    hasUsedPresentationElements: false,
    initialFocus: false,
    noMatches: false,
    showList: false,
    sortBy: null,
    sortedOpts: null
  };

  selectOpt = val => {
    this.focusOnTypeAhead(null, true, false)
    this.setState({
      focusedOption: null,
      hasUsedPresentationElements: true,
      showList: false,
      sortBy: null,
      sortedOpts: this.props.options
    })
    this.props.onChange(this.props.formId, this.props.name, val)
  };

  focusOnTypeAhead = (e, override = false, showList = true) => {
    const typeaheadId = `${this.props.name}-placeholder`
    const allowFocus = !this.state.initialFocus || override

    if (!this.state.initialFocus) {
      this.onFocusIn(e)
    }

    if (e) {
      e.preventDefault()
    }

    if (document.getElementById(typeaheadId) && allowFocus) {
      if (document.activeElement && document.activeElement.id !== typeaheadId) {
        document.getElementById(typeaheadId).focus()
      }
      this.setState({
        initialFocus: true,
        showList: showList
      })
    }
  };

  isInsideTheSelectWrapper = domElement => {
    let parent = domElement
    while (parent && parent.tagName) {
      if (parent.id === `${this.props.name}-label`) {
        return true
      } else if (parent.tagName === 'BODY') {
        return false
      } else {
        parent = parent.parentNode
      }
    }
  };

  isInsideTheSelectPlaceholder = domElement => {
    let parent = domElement
    while (parent && parent.tagName) {
      if (parent.id === `${this.props.name}-placeholder-label`) {
        return true
      } else if (parent.tagName === 'BODY') {
        return false
      } else {
        parent = parent.parentNode
      }
    }
  };

  onKeyDown = e => {
    const key = e.which || e.keyCode
    const currValue = this.state.focusedOption || null
    const options = this.state.sortedOpts

    // close if esc key
    if (key === 27) {
      const typeaheadId = `${this.props.name}-placeholder`
      if (document.getElementById(typeaheadId)) {
        document.getElementById(typeaheadId).focus()
      }
      this.setState({
        focusedOption: null,
        showList: false,
        sortBy: null,
        sortedOpts: this.props.options
      })
    } else if (key === 40 || key === 38) {
      // arrow keys
      e.preventDefault()
      let nextValue = currValue
        ? options.find(
            (opt, i) =>
              opt && opt.value
                ? options[i - 1] &&
                  options[i - 1].value.toString() === currValue.toString()
                : options[i - 1] &&
                  options[i - 1].toString() === currValue.toString()
          )
        : options[0].value ? options[0].value : options[0]
      let prevValue = currValue
        ? options.find(
            (opt, indx) =>
              opt.value
                ? options[indx + 1] &&
                  options[indx + 1].value.toString() === currValue.toString()
                : options[indx + 1] &&
                  options[indx + 1].toString() === currValue.toString()
          )
        : options[0].value ? options[0].value : options[0]

      nextValue = nextValue && nextValue.value ? nextValue.value : nextValue
      prevValue = prevValue && prevValue.value ? prevValue.value : prevValue

      if (key === 40) {
        // arrow down, open and go to next opt
        const newDownFocus =
          nextValue ||
          (options[0] && options[0].value ? options[0].value : options[0])
        this.setState(
          {
            focusedOption: newDownFocus,
            hasUsedPresentationElements: true,
            showList: true
          },
          () => {
            const elem = document.getElementById(
              `input-${this.props.name}-placeholder-${(
                newDownFocus || ''
              ).replace(/\s/g, '-')}`
            )
            if (elem) {
              elem.focus()
            } else {
              console.error(
                'cannot find option with id ' +
                  `input-${this.props.name}-placeholder-${(
                    newDownFocus || ''
                  ).replace(/\s/g, '-')}`
              )
            }
          }
        )
      } else if (key === 38) {
        // arrow up, go to prev opt
        const newUpFocus =
          prevValue ||
          (options[options.length - 1] && options[options.length - 1].value
            ? options[options.length - 1].value
            : options[options.length - 1])
        this.setState(
          {
            focusedOption: newUpFocus,
            hasUsedPresentationElements: true,
            showList: true
          },
          () => {
            const elem = newUpFocus
              ? document.getElementById(
                  `input-${this.props.name}-placeholder-${(
                    newUpFocus || ''
                  ).replace(/\s/g, '-')}`
                )
              : document.getElementById(`${this.props.name}-placeholder`)
            if (elem) {
              elem.focus()
            } else {
              console.error(
                'cannot find option with id ' +
                  `input-${this.props.name}-placeholder-${(
                    newUpFocus || ''
                  ).replace(/\s/g, '-')}`
              )
            }
          }
        )
      }
    }
  };

  onFocusIn = e => {
    if (e) {
      e.preventDefault()
    }

    this.setState({
      initialFocus: true,
      focused: true
    })

    if (this.props.onFocus) {
      this.props.onFocus(this.props.formId, this.props.name)
    }
  };

  onFocusOut = e => {
    this.setState({
      focused: false
    })

    this.closeOpts(e)

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  };

  closeOpts = e => {
    if (e) {
      e.persist()
    }

    if (
      e &&
      (e.relatedTarget && !this.isInsideTheSelectPlaceholder(e.relatedTarget))
    ) {
      this.setState({
        focusedOption: null,
        showList: false
      })

      const select = document.getElementById(this.props.name)

      if (this.props.onBlur) {
        this.props.onBlur(null, select)
      }
    }
  };

  sortResults = e => {
    let value =
      e && e.target && e.target.value && e.target.value[0] === ' '
        ? e.target.value.trim()
        : (e && e.target && e.target.value) || null

    const sortValue =
      value && value.replace(/\s/g, '') && value.replace(/\s/g, '').length
        ? value
            .toString()
            .replace(/(Filtering by:\s)/g, '')
            .replace(/(Filtering by:)/g, '')
        : ''

    const sortedOpts = this.props.options.filter(opt =>
      compareLetters(sortValue, opt.label ? opt.label : opt)
    )

    this.setState({
      hasUsedPresentationElements: true,
      noMatches: !((!!this.props.value || !!sortValue) && !!sortedOpts.length),
      showList: true,
      sortBy: sortValue,
      sortedOpts: sortedOpts
    })
  };

  toggleList = e => {
    e.preventDefault()

    if (!this.state.initialFocus) {
      this.onFocusIn(e)
    }

    this.setState({
      hasUsedPresentationElements: true,
      focusedOption: null,
      noMatches: !this.state.showList ? this.state.noMatches : false,
      showList: !this.state.showList
    })
  };

  componentWillReceiveProps = newProps => {
    if (newProps.options.length != this.props.options.length) {
      this.setState({
        sortBy: null,
        sortedOpts: this.props.options
      })
    }
  };

  componentDidMount() {
    this.setState({
      sortedOpts: this.props.options
    })

    const requiredProps = ['formId', 'label', 'name', 'onChange', 'options']

    requiredPropsLogger(this.props, requiredProps, [], true)
  }

  renderPlaceholderOptions = sortedOpts => {
    const { name } = this.props
    return sortedOpts.map((opt, i) => {
      return opt.label ? (
        <li key={`${name}-opt-${i}`} role='option'>
          <button
            id={`input-${name}-placeholder-${opt.value.replace(/\s/g, '-')}`}
            tabIndex={1}
            onClick={e => {
              e.preventDefault()
              this.selectOpt(opt.value)
            }}
            aria-labelledby={`${name}-opt-${i}-text`}
          >
            <span id={`${name}-opt-${i}-text`}>{opt.label}</span>
          </button>
        </li>
      ) : (
        <li key={`${name}-opt-${i}`} role='option'>
          <button
            id={`input-${name}-placeholder-${opt.replace(/\s/g, '-')}`}
            tabIndex={1}
            onClick={e => {
              e.preventDefault()
              this.selectOpt(opt)
            }}
            aria-labelledby={`${name}-opt-${i}-text`}
          >
            <span id={`${name}-opt-${i}-text`}>{opt}</span>
          </button>
        </li>
      )
    })
  };

  render() {
    const {
      containerClass,
      error,
      formData,
      name,
      label,
      loading,
      onChange,
      options,
      showLabel,
      suppressErrors,
      typeAhead,
      validateAs,
      value,
      ...props
    } = this.props
    const sortedOpts = this.state.sortedOpts || this.props.options

    const opts = sortedOpts.map((opt, i) => {
      return opt.label ? (
        <option key={`${name}-opt-${i}`} value={opt.value} tabIndex={-1}>
          {opt.label}
        </option>
      ) : (
        <option key={`${name}-opt-${i}`} value={opt} tabIndex={-1}>
          {opt}
        </option>
      )
    })

    const placeholderOpts = this.renderPlaceholderOptions(sortedOpts)

    let attr = {}

    if (props.required) {
      attr['required'] = true
      attr['aria-required'] = true
    }

    let err = error
    if (this.state.noMatches) {
      err = 'No matches found.'
    } else if (
      Object.keys(this.props).indexOf('value') === -1 &&
      formData &&
      Object.keys(formData).indexOf(name) > -1
    ) {
      // formData prop was passed in instead of value and error
      attr.value = formData[name].value
      err = formData[name].error
    } else {
      attr.value = value
    }

    if (!props.onChange) {
      attr.readOnly = true
    }

    // in case options' values are different from their labels
    let translateVal = options[0] && !!options[0].label
    let activeOptLabel
    if (translateVal && (value || value === 0 || value === false)) {
      activeOptLabel = options.filter(
        opt => opt.value.toString() === value.toString()
      )[0]
      activeOptLabel = activeOptLabel ? activeOptLabel.label : 'Select'
    }

    const typeAheadDisplay = this.state.sortBy
      ? `Filtering by: ${this.state.sortBy}`
      : this.state.sortBy === ''
        ? ''
        : translateVal ? activeOptLabel : value || 'Select'

    const displayValue = translateVal
      ? activeOptLabel || 'Select'
      : value || 'Select'

    const labelText = (
      <span
        className={`Input-label-text ${!showLabel ? 'u-sr-only' : ''}`}
        id={`${name}-label-text`}
      >
        {label}
        {attr.required && (
          <span>
            {'\u00A0'}*<span className='u-sr-only'> required field</span>
          </span>
        )}
        {loading ? <Loading /> : null}
      </span>
    )

    const placeholderElement = (
      <div
        className={`Input-label SelectInput ${containerClass || ''}`}
        id={`${name}-placeholder-label`}
        aria-labelledby={`${name}-label-text`}
      >
        {labelText}
        <span aria-controls={name} className='SelectInput-placeholderWrapper'>
          {options.length && typeAhead ? (
            <input
              className={`Btn Input-placeholder non-sr-only ${
                this.state.showList ? 'is-open' : ''
              } ${error ? 'Input--invalid' : ''} ${
                this.state.sortBy || this.state.sortBy === ''
                  ? 'SelectInput-typeahead-helperText'
                  : ''
              }`}
              type='text'
              value={typeAheadDisplay}
              id={`${name}-placeholder`}
              name='autofill-buster'
              onChange={this.sortResults}
              placeholder={this.props.placeholder}
              aria-label={`${
                value ? `Selected Option: ${displayValue}` : 'Typeahead'
              }.\
                    Type characters to filter your list of Selectable Options, or press the arrow keys to view full list.`}
            />
          ) : (
            <button
              disabled={!options.length}
              className={`${
                !options.length ? 'Btn is-disabled' : 'Btn'
              } Input-placeholder non-sr-only ${
                this.state.showList ? 'is-open' : ''
              } ${error ? 'Input--invalid' : ''}`}
              aria-label={`${
                value ? `Selected Option: ${displayValue}. ` : ''
              }Press the arrow keys to view and choose Selectable Options.`}
              id={`${name}-placeholder`}
              onClick={e => {
                e.preventDefault()
              }}
            >
              {this.props.placeholder && !value ? (
                <span className='u-grayed-out'>{this.props.placeholder}</span>
              ) : (
                displayValue
              )}
            </button>
          )}
          {err &&
            !this.state.showList &&
            !this.state.focused &&
            !suppressErrors && (
              <ErrorTip contents={err} className='ErrorTip--select' />
            )}
          {this.state.showList && (
            <ul
              className='SelectInput-opts non-sr-only'
              aria-labelledby={`${name}-label-text`}
              aria-expanded={this.state.showList}
              id={name}
            >
              {placeholderOpts}
            </ul>
          )}
        </span>
      </div>
    )

    return (
      <div
        onBlur={this.onFocusOut}
        onFocus={
          typeAhead
            ? e => this.focusOnTypeAhead(e, false, !this.state.showList)
            : !this.state.showList
              ? this.toggleList
              : e => {
                  e.preventDefault()
                }
        }
        onKeyDown={this.onKeyDown}
        id={`${name}-label`}
        className={`SelectInput-wrapper ${containerClass || ''}`}
      >
        {placeholderElement}
        <label
          className={'Input-label SelectInput u-sr-only'}
          htmlFor={name}
          id={`${name}-label`}
          tabIndex={-1}
          aria-hidden
        >
          <select
            name={name}
            id={name}
            className='u-sr-only'
            data-validate={validateAs}
            onChange={e => this.selectOpt(e.target.value)}
            aria-labelledby={`${name}-label-text`}
            tabIndex={-1}
            {...attr}
          >
            <option value=''>Select</option>
            {opts}
          </select>
        </label>
      </div>
    )
  }
}

SelectInput.propTypes = {
  containerClass: PropTypes.string,
  error: PropTypes.string,
  formData: PropTypes.object,
  formId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  loading: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      }),
      PropTypes.string
    ]).isRequired
  ),
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  suppressErrors: PropTypes.bool,
  typeAhead: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ])
}

SelectInput.defaultProps = {
  options: [],
  typeAhead: true,
  value: ''
}

export default SelectInput
