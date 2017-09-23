import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { validatorAggregator as validator } from './validator'
import {
  addFormError,
  clearForm,
  createForm,
  deleteFormError,
  updateForm } from './formActions'

// import './styles/forms.scss'
// import './styles/inputs.scss'

// container for wrapping all forms with needed methods
export class Form extends React.Component {
  state = {
    prepopulated: false,
    processingRequest: false
  }

  static propTypes = {
    addFormError: PropTypes.func,
    clearForm: PropTypes.func,
    createForm: PropTypes.func,
    deleteFormError: PropTypes.func,
    fieldNames: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string.isRequired, type: PropTypes.string })
      ])
    ).isRequired,
    forms: PropTypes.object,
    id: PropTypes.string.isRequired,
    prepopulateData: PropTypes.object,
    preserveAfterUnmount: PropTypes.bool,
    submitForm: PropTypes.func.isRequired,
    updateForm: PropTypes.func,
    validationHelp: PropTypes.shape({
      errorLanguage: PropTypes.object,
      dictionary: PropTypes.object
    })
  } // make sure only those that don't come from redux are declared

  static mapDispatchToProps(dispatch, ownProps) {
    return {
      addFormError: (formId=ownProps.id, fieldName, errorMessage) => {
        dispatch(addFormError(formId, fieldName, errorMessage))
      },
      clearForm: (formId=ownProps.id) => {
        dispatch(clearForm(formId))
      },
      createForm: (formId=ownProps.id, formObject) => {
        dispatch(createForm(formId, formObject))
      },
      deleteFormError: (formId=ownProps.id, fieldName) => {
        dispatch(deleteFormError(formId, fieldName))
      },
      updateForm: (e=null, formId=ownProps.id, fieldName=null, optValue=null, optType=null) => { // optType is for testing
        const type = optType
          || (document.getElementById(fieldName)
              ? document.getElementById(fieldName)
              : [...document.getElementsByName(fieldName)][0]
            ).getAttribute('type')
        dispatch(updateForm(e, formId, fieldName, optValue, optType))
      }
    }
  }

  static mapStateToProps(state) {
    return {
      forms: state.forms
    }
  }

  checkField = (e, elem=null) => {
    const field = elem && elem.getAttribute ? elem : e.target
    const fieldName = field.getAttribute('name')
    const fieldValue = field.value
    const isRequired = field.getAttribute('aria-required') || field.getAttribute('required')

    const thisForm = this.props.forms && this.props.forms[this.props.id] ? { ...this.props.forms[this.props.id] } : null
    const fieldStatus =
      validator(
        { [fieldName]: { value: fieldValue, validateAs: field.getAttribute('data-validate'), name: fieldName} },
        this.props.validationHelp ? this.props.validationHelp.errorLanguage : null,
        this.props.validationHelp ? this.props.validationHelp.dictionary : null
      )
    const allowNull = !isRequired || (fieldValue && isRequired)

    if (fieldStatus.isValid && allowNull) {
      this.props.deleteFormError(this.props.id, fieldName)
    } else {
      this.props.addFormError(this.props.id, fieldName, fieldStatus.warnings[fieldName])
    }
  }

  submitForm = (e) => {
    e.preventDefault()

    this.setState({
      processingRequest: true
    })

    let thisForm = this.props.forms && this.props.forms[this.props.id] ? { ...this.props.forms[this.props.id] } : null
    const unconvertedForm = { ...thisForm }

    let files

    for (let field in thisForm) {
      if (field != 'isValid' && (!/(\.|\/)(gif|jpe?g|png|txt|pdf|doc?x)$/.test(thisForm[field].value)) && (document.getElementById(field))) {
        // validate each field in case onBlur on that field never triggered
        this.checkField(null, document.getElementById(field))
      }

      if (thisForm[field].value) {
        if (field.indexOf('confirm') > -1) {
          delete thisForm[field]
        } else if (/(\.|\/)(gif|jpe?g|png|txt|pdf|doc?x)$/.test(thisForm[field].value)) {
          // file placeholder
          files = files || new FormData()
          files.append(field, document.getElementById(field).files[0], thisForm[field].value)
          delete thisForm[field]
        } else if (field != 'isValid') {
          thisForm[field] = thisForm[field].value
        }
      } else if (field != 'isValid') {
        delete thisForm[field]
      }
    } 

    if (thisForm && thisForm.isValid) {
      delete thisForm.isValid

      const successCallback = () => {
        this.setState({
          processingRequest: false
        })
      }

      const failCallback = (err) => {
        let message = err.response ? err.response.data.error.message : err
        console.log({ ...err})
        this.setState({
          processingRequest: false
        })
      }

      return this.props.submitForm(thisForm, files, successCallback, failCallback)
    } else {
      delete thisForm.isValid

      this.setState({
        processingRequest: false
      })

      // debugging helper
      console.log(`form id '${this.props.id}' has invalid fields`, unconvertedForm)
    }
  }

  focusOnFirst = () => {
    const form = document.getElementById(this.props.id)
    if (form) {
      let firstInput = [...form.querySelectorAll('input, select, textarea')][0]
      if (firstInput) {
        firstInput.focus()
      }
    }
  }

  manualFieldUpdate = (formId=this.props.id, fieldName, fieldValue) => {
    this.props.updateForm(null, formId, fieldName, fieldValue)
  }

  populateFields = (props, responseData) => {
    let formData = {}
    // initialize the form with all fields inside
    props.fieldNames.forEach((fieldName) => {
      if (fieldName.type) {
        formData[fieldName] = {}

        switch(fieldName.type) {
          case 'checkbox':
            formData[fieldName.name].value = false
            break
          case 'radio':
            formData[fieldName.name].value = false
            break
          default:
            formData[fieldName.name] = { value: '' }
        }
      } else {
        formData[fieldName.toString()] = { value: '' }
      }
    })

    if (responseData) {
      for (var key in responseData) {
        // explode out any nested fields we might need
        if (typeof responseData[key] == 'object') {
          for (var field in responseData[key]) {
            if (formData[field]) { // we only want fields that exist in the form to update
              formData[field].value = responseData[key][field]
            }
          }
        } else if (formData[key]) {
          formData[key].value = responseData[key]

          if (!this.state.prepopulated && responseData[key]) {
            this.setState({
              prepopulated: true
            })
          }
        }
      }
    }

    props.createForm(props.id, formData)
  }

  componentWillUnmount = () => {
    if (!this.props.preserveAfterUnmount) {
      this.props.clearForm()
    }
  }

  componentDidMount = () => {
    if (this.props.prepopulateData) {
      this.populateFields(this.props, prepopulateData)
    } else {
      this.populateFields(this.props)
    }

    this.focusOnFirst()
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.prepopulateData && (
        !this.props.prepopulateData ||
        (Object.values(this.props.prepopulateData).sort().toString() != Object.values(newProps.prepopulateData).sort().toString())
      )
    ) {
      this.populateFields(newProps, newProps.prepopulateData)
    }

    if (newProps.fieldNames.length != Object.keys(newProps.forms[newProps.id]).length-1) { // ignore isValid
      this.populateFields(newProps);
    }
  }

  render() {
    let { submitForm, prepopulateData, ...props } = this.props
    
    // make sure this works if the form has one child or many
    let children = props.children
      ? (Array.isArray(this.props.children) ? this.props.children : [this.props.children])
      : [];
    let thisForm = props.forms && props.forms[props.id] ? props.forms[props.id] : null

    // clone the children to pass in custom props related to entire form
    let formChildren = children.length ? (
      React.Children.map(children, (child, indx) => {
          return React.cloneElement(child, {
            addFormError: props.addFormError,
            checkField: this.checkField,
            deleteFormError: props.deleteFormError,
            formData: thisForm,
            formId: props.id,
            isValid: thisForm && thisForm.isValid,
            manualFieldUpdate: this.manualFieldUpdate,
            prepopulated: this.state.prepopulated,
            processingRequest: this.state.processingRequest,
            updateForm: props.updateForm,
            submitForm: this.submitForm,
            ...props
          })
      })
    ) : children;

    return (
      <div>
        { formChildren }
      </div>
    )
  }
}

export default connect(Form.mapStateToProps, Form.mapDispatchToProps)(Form)
