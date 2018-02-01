export default function formReducer(state = {}, action) {
  let newForms = state

  switch (action.type) {
    case 'ADD_FORM_ERROR':
      if (!newForms[action.formId]) {
        newForms[action.formId] = {}
      }
      if (!newForms[action.formId].fields) {
        newForms[action.formId].fields = {}
      }
      if (!newForms[action.formId].fields[action.fieldName]) {
        newForms[action.formId].fields[action.fieldName] = {}
      }
      newForms[action.formId].isValid = false
      newForms[action.formId].fields[action.fieldName].error = action.errorMsg
      return { ...newForms }

    case 'CHECK_COMPLETED': {
      let formId = action.formId
      let fieldName = action.fieldName
      // if (!formId) {
      //   formId = Object.keys(newForms).filter(key => (newForms[key].visibleFields || []).length)
      // }
      return {
        ...newForms,
        [formId]: {
          ...newForms[formId],
          awaitingCheck: (newForms.awaitingCheck || []).filter(obj => obj.formId !== action.formId)
        }
      }
    }

    case 'CLEAR_FORM':
      newForms[action.formId] = {}
      return { ...newForms }

    case 'CREATE_FORM':
      newForms[action.formId] = action.formObject
      newForms[action.formId].isValid = true
      return { ...newForms }

    case 'DELETE_FORM_ERROR':
      if (newForms[action.formId] && newForms[action.formId].fields && newForms[action.formId].fields[action.fieldName]) {
        delete newForms[action.formId].fields[action.fieldName].error
      }
      const allOtherErrors = newForms[action.formId] && newForms[action.formId].fields
        ? Object.keys(newForms[action.formId].fields)
          .filter((key) => (key !== action.fieldName) && (!!newForms[action.formId].fields[key].error))
        : null

      if (!allOtherErrors.length) {
        newForms[action.formId].isValid = true
      }
      return { ...newForms }

    case 'TRIGGER_MULTIPLE_CHECK': {
      console.log('trigger multiple in reducer')
      let formId = action.formId
      let fieldNames = action.fieldNames || []
      // if (!formId) {
      //   formId = Object.keys(newForms).filter(key => (newForms[key].visibleFields || []).length)
      // }
      // if (!fieldNames) {
      //   fieldNames = newForms[formId].visibleFields || []
      // }
      return {
        ...newForms,
        [formId]: {
          ...newProps[formId],
          awaitingCheck: [ ...(newForms.awaitingCheck || []), { formId, fieldNames } ]
        }
      }
    }

    case 'UPDATE_FORM':
      if (!newForms[action.formId]) {
        newForms[action.formId] = {}
      }
      if (!newForms[action.formId].fields) {
        newForms[action.formId].fields = {}
      }
      if (
        !newForms[action.formId].fields[action.fieldName] ||
        newForms[action.formId].fields[action.fieldName] === ''
      ) {
        newForms[action.formId].fields[action.fieldName] = {}
      }
      newForms[action.formId].fields[action.fieldName].value = action.fieldValue
      return { ...newForms }

    case 'UPDATE_FORM_FILE':
      if (!newForms[action.formId]) {
        newForms[action.formId] = {}
      }
      if (!newForms[action.formId].fields) {
        newForms[action.formId].fields = {}
      }
      if (
        !newForms[action.formId].fields[action.fieldName] ||
        newForms[action.formId].fields[action.fieldName] === ''
      ) {
        newForms[action.formId].fields[action.fieldName] = {}
      }
      let val
      if (action.fieldValue && Array.isArray(action.fieldValue)) {
        val = [...action.fieldValue]
      } else {
        val = [ action.fieldValue ]
      }
      newForms[action.formId].fields[action.fieldName].value = val.length
        ? [...(newForms[action.formId].fields[action.fieldName].value || []), ...val]
        : []
      return { ...newForms }

    default:
      return state
  }
}