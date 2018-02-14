import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { validatorAggregator as validator } from './validator'
import {
  addFormError,
  checkCompleted,
  clearForm,
  createForm,
  deleteFormError,
  onFocus,
  updateDirtyFieldsArr,
  updateVisibleFieldsArr,
  checkForVisibleFields,
  updateForm
} from './formActions'

import './styles/form.scss'
import './styles/inputs.scss'

// container for wrapping all forms with needed methods
export class Form extends React.Component {
  state = {
    attemptedSubmit: false,
    prepopulated: false,
    processingRequest: false
  };

  static propTypes = {
    addFormError: PropTypes.func,
    ignoreFocusOnFirstElement: PropTypes.bool,
    clearForm: PropTypes.func,
    createForm: PropTypes.func,
    deleteFormError: PropTypes.func,
    fieldNames: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string
        })
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
  }; // make sure only those that don't come from redux are declared for better error logging to end user

  static mapDispatchToProps(dispatch, ownProps) {
    return {
      checkForVisibleFields: (formId = ownProps.id) => {
        dispatch(checkForVisibleFields(formId))
      },
      updateVisibleFieldsArr: (formId = ownProps.id, fieldNames) => {
        dispatch(updateVisibleFieldsArr(formId, fieldNames))
      },
      onFocus: (formId = ownProps.id, fieldName) => {
        dispatch(onFocus(formId, fieldName))
      },
      updateDirtyFieldsArr: (formId = ownProps.id, fieldName) => {
        dispatch(updateDirtyFieldsArr(formId, fieldName))
      },
      addFormError: (formId = ownProps.id, fieldName, errorMessage) => {
        dispatch(addFormError(formId, fieldName, errorMessage))
      },
      checkCompleted: (formId = ownProps.id) => {
        dispatch(checkCompleted(formId))
      },
      clearForm: (formId = ownProps.id) => {
        dispatch(clearForm(formId))
      },
      createForm: (formId = ownProps.id, formObject) => {
        dispatch(createForm(formId, formObject))
      },
      deleteFormError: (formId = ownProps.id, fieldName) => {
        dispatch(deleteFormError(formId, fieldName))
      },
      updateForm: (
        e = null,
        formId = ownProps.id,
        fieldName = null,
        optValue = null,
        optType = null,
        optMultiple = null
      ) => {
        // optType is for manualFieldUpdate and testing //optMultiple is for multi file uploads
        fieldName =
          fieldName || (e && e.target ? e.target.getAttribute('name') : null)
        const type =
          optType ||
          (
            document.getElementById(fieldName) ||
            [...document.getElementsByName(fieldName)][0]
          ).getAttribute('type')
        dispatch(updateForm(e, formId, fieldName, optValue, type, optMultiple))
      }
    }
  }

  static mapStateToProps(state) {
    return {
      forms: state.forms
    }
  }

  checkField = async (e, elem = null) => {
    const field = elem && elem.getAttribute ? elem : e.target
    const fieldName = field.getAttribute('name')
    const fieldValue = field.value.trim()
    const isRequired =
      field.getAttribute('aria-required') || field.getAttribute('required')

    try {
      const fieldStatus = await validator(
        {
          [fieldName]: {
            value: fieldValue,
            validateAs: field.getAttribute('data-validate'),
            name: fieldName
          }
        },
        this.props.validationHelp
          ? this.props.validationHelp.errorLanguage
          : null,
        this.props.validationHelp ? this.props.validationHelp.dictionary : null
      )
      const allowNull = !isRequired || (fieldValue && isRequired)

      if (fieldStatus.isValid && allowNull) {
        this.props.deleteFormError(this.props.id, fieldName)
        return Promise.resolve(true)
      } else {
        this.props.addFormError(
          this.props.id,
          fieldName,
          fieldStatus.warnings[fieldName]
        )
        return Promise.resolve(false)
      }
    } catch (err) {
      throw new Error(err)
    }
  };

  processFormDataForSubmit = thisForm => {
    for (let field in thisForm) {
      if (thisForm[field].value || thisForm[field].value === '') {
        if (field.indexOf('confirm') > -1) {
          // don't send two of the same field (confirm is for front end)
          delete thisForm[field]
        } else if (
          thisForm[field].value[0] &&
          thisForm[field].value[0].type &&
          thisForm[field].value[0].name
        ) {
          // contains files
          thisForm.files =
            thisForm.files &&
            thisForm.files.keys() &&
            Array.from(thisForm.files.keys()).length
              ? thisForm.files
              : new FormData()
          thisForm[field].value.forEach((elem, i) => {
            thisForm.files.append(`${field}[${i}]`, elem)
          })
          delete thisForm[field]
        } else if (field != 'isValid') {
          thisForm[field] = thisForm[field].value
        }
      }
    }

    return thisForm
  };

  submitForm = async e => {
    e.preventDefault()

    this.setState({
      attemptedSubmit: true,
      processingRequest: true
    })

    const thisForm =
      this.props.forms && this.props.forms[this.props.id]
        ? this.processFormDataForSubmit({
            ...this.props.forms[this.props.id].fields
          })
        : {}
    const unconvertedForm = { ...this.props.forms[this.props.id] }

    const files = thisForm.files
    if (thisForm.files) {
      delete thisForm.files
    }

    // check each field if it's not a file or 'isValid'
    const checkArr = []
    for (let field in thisForm) {
      if (
        field != 'isValid' &&
        ((thisForm[field].value || thisForm[field].value === '') &&
          !thisForm[field].value.type) /* don't check files */ &&
        document.getElementById(field)
      ) {
        // validate each field in case onBlur on that field never triggered
        checkArr.push(this.checkField(null, document.getElementById(field)))
      }
    }

    Promise.all(checkArr)
      .then(() => {
        if (thisForm && this.props.forms[this.props.id].isValid) {
          const successCallback = () => {
            this.setState({
              processingRequest: false
            })
          }

          const failCallback = err => {
            // let message = err.response ? err.response.data.error.message : err
            console.log({ ...err })
            this.setState({
              processingRequest: false
            })
          }
          return this.props.submitForm(
            thisForm,
            files,
            successCallback,
            failCallback
          )
        } else {
          delete thisForm.isValid

          this.setState({
            processingRequest: false
          })

          // debugging helper
          console.log(
            `form id '${this.props.id}' has invalid fields`,
            unconvertedForm
          )
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  };

  focusOnFirst = () => {
    const form = document.getElementById(this.props.id)
    if (form) {
      let firstInput = [...form.querySelectorAll('input, select, textarea')][0]
      if (firstInput) {
        firstInput.focus()
      }
    }
  };

  getVisibleInputs = formId => {
    const id = formId || this.props.id || this.props.formId
    const el = document.getElementById(id)
    if (el) {
      const matches = el.querySelectorAll('input, select, textarea')
      const fieldNames = []
      for (var i = 0; i < matches.length; i++) {
        fieldNames.push(matches[i].id)
      }
      this.props.updateVisibleFieldsArr(id, fieldNames)
    }
  };

  manualFieldUpdate = (
    formId = this.props.id,
    fieldName,
    fieldValue,
    type = 'text',
    multi = false
  ) => {
    this.props.updateForm(null, formId, fieldName, fieldValue, type, multi)
  };

  populateFields = (props, responseData, oldFields) => {
    let formData = { fields: {} }
    // initialize the form with all fields inside

    props.fieldNames.forEach(fieldName => {
      if (fieldName.type) {
        formData.fields[fieldName.name] = {}

        switch (fieldName.type) {
          case 'checkbox':
            formData.fields[fieldName.name].value = false
            break
          case 'radio':
            formData.fields[fieldName.name].value = false
            break
          default:
            formData.fields[fieldName.name] = { value: '' }
        }
      } else {
        formData.fields[fieldName.toString()] = { value: '' }
      }
    })

    if (oldFields) {
      formData.fields = { ...formData.fields, ...oldFields }
    }

    formData.awaitingCheck = []
    formData.visibleFields = []
    formData.touchedFieds = []
    formData.dirtyFields = []

    if (responseData) {
      for (var key in responseData) {
        // explode out any nested fields we might need
        if (typeof responseData[key] == 'object') {
          for (var field in responseData[key]) {
            if (formData.fields[field]) {
              // we only want fields that exist in the form to update
              formData.fields[field].value = responseData[key][field]
            }
          }
        } else if (formData.fields[key]) {
          formData.fields[key].value = responseData[key]

          if (!this.state.prepopulated && responseData[key]) {
            this.setState({
              prepopulated: true
            })
          }
        }
      }
    }

    props.createForm(props.id, formData)
  };

  componentWillUnmount = () => {
    if (!this.props.preserveAfterUnmount) {
      this.props.clearForm()
    }
  };

  componentDidMount = () => {
    if (this.props.prepopulateData) {
      this.populateFields(this.props, this.props.prepopulateData)
    } else {
      this.populateFields(this.props)
    }

    if (!this.props.ignoreFocusOnFirstElement) {
      this.focusOnFirst()
    }

    this.getVisibleInputs(this.props.id)

    if (this.props.submitRoute) {
      console.log(
        `%c You're using "submitRoute" in form ${
          this.props.id
        }, which comes from a pre-release version of Bloom Forms. Please use "submitForm".`,
        'color: red'
      )
    }
  };

  componentWillReceiveProps = newProps => {
    if (
      newProps.prepopulateData &&
      (!this.props.prepopulateData ||
        Object.values(this.props.prepopulateData)
          .sort()
          .toString() !=
          Object.values(newProps.prepopulateData)
            .sort()
            .toString())
    ) {
      this.populateFields(newProps, newProps.prepopulateData)
    }

    if (newProps.forms[newProps.id].checkForVisibleFields) {
      this.getVisibleInputs(newProps.id)
    }

    if (
      newProps.fieldNames.length !=
      Object.keys(newProps.forms[newProps.id].fields).length
    ) {
      this.populateFields(newProps, null, newProps.forms[newProps.id].fields)
    }

    if (
      newProps.forms[newProps.id] &&
      newProps.forms[newProps.id].awaitingCheck &&
      newProps.forms[newProps.id].awaitingCheck.length
    ) {
      newProps.forms[newProps.id].awaitingCheck[0].fieldNames.forEach(name => {
        const elem = document.getElementById(name)
        if (elem) {
          this.checkField(null, elem)
        }
      })
      this.props.checkCompleted(newProps.id)
    }
  };

  render() {
    let { submitForm, prepopulateData, ...props } = this.props
    // make sure this works if the form has one child or many
    let children = props.children
      ? Array.isArray(this.props.children)
        ? this.props.children
        : [this.props.children]
      : []
    let thisForm =
      props.forms && props.forms[props.id] ? props.forms[props.id] : null
    // clone the children to pass in custom props related to entire form
    let formChildren = children.length
      ? React.Children.map(children, child => {
          return React.cloneElement(child, {
            addFormError: props.addFormError,
            attemptedSubmit: this.state.attemptedSubmit,
            checkField: this.checkField,
            deleteFormError: props.deleteFormError,
            formData: (thisForm && thisForm.fields) || {},
            formId: props.id,
            isValid: thisForm && thisForm.isValid,
            manualFieldUpdate: this.manualFieldUpdate,
            prepopulated: this.state.prepopulated,
            processingRequest: this.state.processingRequest,
            updateForm: props.updateForm,
            submitForm: this.submitForm,
            updateVisibleFieldsArr: this.updateVisibleFieldsArr,
            onFocus: this.onFocus,
            updateDirtyFieldsArr: this.updateDirtyFieldsArr,
            ...props
          })
        })
      : children

    return <div>{formChildren}</div>
  }
}

export default connect(Form.mapStateToProps, Form.mapDispatchToProps)(Form)
