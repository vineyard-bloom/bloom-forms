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
*/

const compareLetters = (str1, str2) => {
  // finding out if the first part of comparison string (str2) matches the typeahead (str1)
  return str1
    ? str2.toLowerCase().slice(0, str1.length).split('').reduce((total, curr, index) => total && (curr === str1.toLowerCase()[index]))
    : true
}

class SelectInput extends React.Component {
  state = {
    hasUsedPresentationElements: false,
    initialFocus: false,
    showList: false,
    sortBy: null,
    sortedOpts: null
  };

  selectOpt = (val) => {
    this.props.onChange(this.props.formId, this.props.name, val);
    this.setState({
      hasUsedPresentationElements: true,
      showList: false,
      sortBy: null,
      sortedOpts: this.props.options
    });
    this.focusOnTypeAhead(null, true)
  };

  focusOnTypeAhead = (e, override=false) => {
    const typeaheadId = `${ this.props.name }-placeholder`
    const allowFocus = !this.state.initialFocus || override

    if (document.getElementById(typeaheadId) && allowFocus) {
      document.getElementById(typeaheadId).focus()
      this.setState({
        initialFocus: true
      })
    }
  }

  isInsideTheSelectPlaceholder = (domElement) => {
    let parent = domElement
    while (parent && parent.tagName) {
      if (parent.id === `${ this.props.name }-placeholder-label`) {
        return true
      } else if (parent.tagName === 'BODY'){
        return false
      } else {
        parent = parent.parentNode
      }
    }
  }

  onKeyDown = (e) => {
    const key = e.which || e.keyCode
    const currValue = document.activeElement.id && document.activeElement.id.includes('input-placeholder')
      ? document.activeElement.id.replace('input-placeholder-', '')
      : null
    const options = this.state.sortedOpts

    // close if esc key
    if (key === 27) {
      const typeaheadId = `${ this.props.name }-placeholder`
      document.getElementById(typeaheadId).focus()
      this.setState({
        showList: false,
        sortBy: null,
        sortedOpts: this.props.options
      })
    } else if (key === 40 || (key === 38)) { // arrow keys
      e.preventDefault();
      let nextValue = currValue
        ? (
          options.find((opt, i) => opt.value
            ? options[i-1] && (options[i-1].value.toString() === currValue.toString())
            : options[i-1] && (options[i-1].toString() === currValue.toString())
          )
        ) : (
          options[0].value ? options[0].value : options[0]
        )
      let prevValue = currValue
        ? (
          options.find((opt, indx) => opt.value
            ? options[indx+1] && (options[indx+1].value.toString() === currValue.toString())
            : options[indx+1] && (options[indx+1].toString() === currValue.toString())
          )
        ) : (
          options[0].value ? options[0].value : options[0]
        )

      nextValue = nextValue && nextValue.value ? nextValue.value : nextValue
      prevValue = prevValue && prevValue.value ? prevValue.value : prevValue

      if (key === 40) { // arrow down, open and go to next opt
        this.setState({
          hasUsedPresentationElements: true,
          showList: true
        }, () => {
          const elem = document.getElementById(`input-placeholder-${nextValue}`)
          if (elem) {
            elem.focus()
          }
        })
      } else if (key === 38) { // arrow up, go to prev opt
        this.setState({
          hasUsedPresentationElements: true,
          showList: true
        }, () => {
          const elem = document.getElementById(`input-placeholder-${prevValue}`)
          if (elem) {
            elem.focus()
          }
        })
      }
    }
  }

  closeOpts = (e) => {
    if (e) { e.persist() }

    if (e && (!e.relatedTarget || !this.isInsideTheSelectPlaceholder(e.relatedTarget))) {
      this.setState({
        showList: false
      })
    }

    const select = document.getElementById(this.props.name)

    if (this.props.onBlur) {
      this.props.onBlur(e, select)
    }
  }

  sortResults = (e) => {
    const sortValue = e.target.value && e.target.value.replace(/\s/g, '') && e.target.value.replace(/\s/g, '').length
      ? e.target.value
      : ''
    this.setState({
      hasUsedPresentationElements: true,
      showList: true,
      sortBy: sortValue,
      sortedOpts: this.props.options.filter((opt) => compareLetters(e.target.value, (opt.label ? opt.label : opt)))
    })
  }

  toggleList = (e) => {
    e.preventDefault();
    this.setState({
      hasUsedPresentationElements: true,
      focusedOpt: null,
      showList: !this.state.showList
    });
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps.options.length != this.props.options.length) {
      this.setState({
        sortBy: null,
        sortedOpts: this.props.options
      })
    }
  }

  componentDidMount() {
    this.setState({
      sortedOpts: this.props.options
    })

    const requiredProps = ['formId', 'label', 'name', 'onChange', 'options']

    requiredPropsLogger(this.props, requiredProps, [], true)
  }

  render() {
    const { containerClass, error, name, label, loading,
      onChange, options, showLabel, typeAhead,
      validateAs, value, ...props } = this.props;
    const sortedOpts = this.state.sortedOpts || this.props.options

    const opts = sortedOpts.map((opt, i) => {
      return opt.label
        ? (
          <option key={ `${name}-opt-${i}` } value={ opt.value } tabIndex={ -1 }>
            { opt.label }
          </option>
        ) : (
          <option key={ `${name}-opt-${i}` } value={ opt } tabIndex={ -1 }>{ opt }</option>
        );
    });

    const placeholderOpts = sortedOpts.map((opt, i) => {
      return opt.label
        ? (
          <li key={ `${ name }-opt-${i}` } onClick={ (e) => this.selectOpt(opt.value) }>
            <button id={ `input-placeholder-${opt.value}` } tabIndex={ this.state.hasUsedPresentationElements ? '0' : '-1' }
              aria-labelledby={ `${ name }-opt-${i}-text` }>
              <span id={ `${ name }-opt-${i}-text` }>
                { opt.label }
              </span>
            </button>
          </li>
        ) : (
          <li key={ `${ name }-opt-${i}` } onClick={ (e) => this.selectOpt(opt) }>
            <button id={ `input-placeholder-${opt}` } tabIndex={ this.state.hasUsedPresentationElements ? '0' : '-1' }
              aria-labelledby={ `${ name }-opt-${i}-text` }>
              <span id={ `${ name }-opt-${i}-text` }>
                { opt }
              </span>
            </button>
          </li>
        );
    })

    let attr = {};

    if (props.required) {
      attr['required'] = true;
      attr['aria-required'] = true;
    }

    let err = error
    if (Object.keys(this.props).indexOf('value') === -1 && formData && (Object.keys(formData).indexOf(name) > -1)) {
      attr.value = formData[name].value
      err = formData[name].error
    } else {
      attr.value = value
    }

    if (!props.onChange) {
      attr.readOnly = true
    }

    // in case options' values are different from their labels
    let translateVal = options[0] && !!options[0].label;
    let activeOptLabel;
    if (translateVal && (value || (value === 0) || (value === false))) {
      activeOptLabel = options.filter((opt) => opt.value.toString() === value.toString())[0];
      activeOptLabel = activeOptLabel ? activeOptLabel.label : 'Select';
    }

    const typeAheadDisplay = this.state.sortBy || (this.state.sortBy === '')
      ? this.state.sortBy
      : (this.props.placeholder && !value
        ? this.props.placeholder
        : (translateVal
          ? activeOptLabel
          : (value || 'Select')
        )
      )
    const displayValue = translateVal ? (activeOptLabel || 'Select') : (value || 'Select')

    const labelText = (
      <span className={ `Input-label-text ${ !showLabel ? 'u-sr-only' : '' }` }
        id={ `${ name }-label-text` }>
        { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
        { loading ? <Loading /> : null }
      </span>
    )

    const placeholderElement = (
        <div className={ `Input-label SelectInput ${ containerClass || '' }` }
          id={ `${ name }-placeholder-label` }
          onBlur={(e) => this.closeOpts(e)} onFocus={(e) => this.focusOnTypeAhead(e)}
          aria-labelledby={ `${ name }-label-text` }>
          { labelText }
          <span onKeyDown={ this.onKeyDown } aria-controls={ name } className='SelectInput-placeholderWrapper'>
            { options.length && typeAhead
              ? (
                <input className={ `Btn Input-placeholder non-sr-only ${ this.state.showList ? 'is-open' : '' } ${ error ? 'Input--invalid' : '' }` }
                  type='text' value={ typeAheadDisplay }
                  id={ `${ name }-placeholder` } name='autofill-buster'
                  onChange={ this.sortResults }
                  aria-label={ `${ value ? `Selected Option: ${displayValue}.` : 'Typeahead' }.\
                    Type characters to filter your list of Selectable Options, or press the arrow keys to view full list.` }
                />
              ) : (
                <button disabled={ !options.length } onClick={ this.toggleList }
                  className={ `${!options.length ? 'Btn is-disabled' : 'Btn'} Input-placeholder non-sr-only ${ this.state.showList ? 'is-open' : '' } ${ error ? 'Input--invalid' : '' }` }
                  aria-label={ `${ value ? `Selected Option: ${ displayValue }. ` : ''}Press the arrow keys to view and choose Selectable Options.` }
                  id={ `${ name }-placeholder` }>
                  { this.props.placeholder && !value
                    ? <span className='u-grayed-out'>{ this.props.placeholder }</span>
                    : displayValue
                  }
                </button>
              )
            }
            { err && !this.state.showList &&
              <ErrorTip contents={ err } className='Tooltip--error--select' />
            }
            { this.state.showList &&
              <ul className='SelectInput-opts non-sr-only' aria-labelledby={ `${ name }-label-text` }
                name={ name }>
                { placeholderOpts }
              </ul>
            }
          </span>
        </div>
    )

    return (
      <div onBlur={(e) => this.closeOpts(e)}>
        { placeholderElement }
        <label className={ `Input-label SelectInput ${ containerClass || '' } u-sr-only` } htmlFor={ name }
          id={ `${ name }-label` } tabIndex={ -1 } aria-hidden>
          <select name={ name } id={ name } className='u-sr-only' data-validate={ validateAs }
            onChange={ (e) => this.selectOpt(e.target.value) } aria-labelledby={ `${ name }-label-text` }
            tabIndex={ -1 }
            { ...attr }>
            <option value=''>Select</option>
            { opts }
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
  typeAhead: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

SelectInput.defaultProps = {
  options: [],
  typeAhead: true,
  value: ''
}

export default SelectInput;
