/* eslint-disable no-case-declarations */
import produce from 'immer'

const formReducer = (state = {}, action) =>
  produce(state, draftForms => {
    switch (action.type) {
      case 'ADD_FORM_ERROR': {
        if (!draftForms[action.formId]) {
          draftForms[action.formId] = {}
        }
        if (!draftForms[action.formId].fields) {
          draftForms[action.formId].fields = {}
        }
        if (!draftForms[action.formId].fields[action.fieldName]) {
          draftForms[action.formId].fields[action.fieldName] = {}
        }
        draftForms[action.formId].isValid = false
        draftForms[action.formId].fields[action.fieldName].error =
          action.errorMsg
        break
      }

      case 'CHECK_COMPLETED': {
        const formId = action.formId
        draftForms[formId].awaitingCheck = (
          draftForms.awaitingCheck || []
        ).filter(obj => obj.formId !== action.formId)
        break
      }

      case 'CLEAR_FORM': {
        draftForms[action.formId].fields = {}
        draftForms[action.formId].awaitingCheck = []
        draftForms[action.formId].touchedFields = []
        draftForms[action.formId].dirtyFields = []
        draftForms[action.formId].visibleFields = []
        delete draftForms[action.formId].isValid
        break
      }

      case 'CHECK_FOR_VISIBLE_FIELDS': {
        draftForms[action.formId].checkForVisibleFields = true
        break
      }

      case 'CREATE_FORM': {
        draftForms[action.formId] = action.formObject
        draftForms[action.formId].awaitingCheck =
          action.formObject.awaitingCheck || []
        draftForms[action.formId].isValid = true
        break
      }

      case 'DELETE_FORM_ERROR': {
        if (
          draftForms[action.formId] &&
          draftForms[action.formId].fields &&
          draftForms[action.formId].fields[action.fieldName]
        ) {
          delete draftForms[action.formId].fields[action.fieldName].error
        }
        const allOtherErrors =
          draftForms[action.formId] && draftForms[action.formId].fields
            ? Object.keys(draftForms[action.formId].fields).filter(
                key =>
                  key !== action.fieldName &&
                  !!draftForms[action.formId].fields[key].error
              )
            : null

        if (!allOtherErrors.length) {
          draftForms[action.formId].isValid = true
        }
        break
      }

      case 'ON_FOCUS': {
        if (!draftForms[action.formId]) {
          draftForms[action.formId] = {}
        }
        if (!draftForms[action.formId].touchedFields) {
          draftForms[action.formId].touchedFields = []
        }
        if (
          draftForms[action.formId].touchedFields.indexOf(action.fieldName) ===
          -1
        ) {
          draftForms[action.formId].touchedFields.push(action.fieldName)
        }
        break
      }

      case 'UPDATE_VISIBLE_FIELDS_ARR': {
        if (!draftForms[action.formId]) {
          draftForms[action.formId] = {}
        }
        draftForms[action.formId].visibleFields = action.fields
        draftForms[action.formId].checkForVisibleFields = false
        break
      }

      case 'TRIGGER_MULTIPLE_CHECK': {
        let formId = action.formId
        let fieldNames = action.fieldNames || []
        // if (!formId) {
        //   formId = Object.keys(draftForms).filter(key => (draftForms[key].visibleFields || []).length)
        // }
        // if (!fieldNames) {
        //   fieldNames = draftForms[formId].visibleFields || []
        // }
        draftForms[formId].awaitingCheck = [
          ...(draftForms.awaitingCheck || []),
          { formId, fieldNames }
        ]
        break
      }

      case 'UPDATE_FORM': {
        if (!draftForms[action.formId]) {
          draftForms[action.formId] = {}
        }
        if (!draftForms[action.formId].fields) {
          draftForms[action.formId].fields = {}
        }
        if (!draftForms[action.formId].dirtyFields) {
          draftForms[action.formId].dirtyFields = []
        }
        if (
          draftForms[action.formId].dirtyFields.indexOf(action.fieldName) === -1
        ) {
          draftForms[action.formId].dirtyFields.push(action.fieldName)
        }
        if (
          !draftForms[action.formId].fields[action.fieldName] ||
          draftForms[action.formId].fields[action.fieldName] === ''
        ) {
          draftForms[action.formId].fields[action.fieldName] = {}
        }
        draftForms[action.formId].fields[action.fieldName].value =
          action.fieldValue

        break
      }

      case 'UPDATE_FORM_FILE': {
        if (!draftForms[action.formId]) {
          draftForms[action.formId] = {}
        }
        if (!draftForms[action.formId].fields) {
          draftForms[action.formId].fields = {}
        }
        if (
          !draftForms[action.formId].fields[action.fieldName] ||
          draftForms[action.formId].fields[action.fieldName] === ''
        ) {
          draftForms[action.formId].fields[action.fieldName] = {}
        }

        let val
        if (action.fieldValue && Array.isArray(action.fieldValue)) {
          val = [...action.fieldValue]
        } else {
          val = [action.fieldValue]
        }
        if (!action.multiple) {
          draftForms[action.formId].fields[action.fieldName].value =
            action.fieldValue
        } else {
          draftForms[action.formId].fields[action.fieldName].value = val.length
            ? [
                ...(draftForms[action.formId].fields[action.fieldName].value ||
                  []),
                ...val
              ]
            : []
        }

        if (
          draftForms[action.formId].dirtyFields.indexOf(action.fieldName) === -1
        ) {
          draftForms[action.formId].dirtyFields.push(action.fieldName)
        }

        break
      }
    }
  })

export default formReducer
