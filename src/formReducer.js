export default function formReducer(state = {}, action) {
  let newForms = state

  switch (action.type) {
    case 'ADD_FORM_ERROR':
      if (!newForms[action.formId]) {
        newForms[action.formId] = {}
      }
      if (!newForms[action.formId][action.fieldName]) {
        newForms[action.formId][action.fieldName] = {}
      }
      newForms[action.formId].isValid = false
      newForms[action.formId][action.fieldName].error = action.errorMsg
      return { ...newForms }

    case 'CLEAR_FORM':
      newForms[action.formId] = {}
      return { ...newForms }

    case 'CREATE_FORM':
      newForms[action.formId] = action.formObject
      newForms[action.formId].isValid = true
      return { ...newForms }

    case 'DELETE_FORM_ERROR':
      if (newForms[action.formId] && newForms[action.formId][action.fieldName]) {
        delete newForms[action.formId][action.fieldName].error
      }
      const allOtherErrors = newForms[action.formId]
        ? Object.keys(newForms[action.formId])
          .filter((key) => (key !== action.fieldName) && (!!newForms[action.formId][key].error))
        : null

      if (!allOtherErrors.length) {
        newForms[action.formId].isValid = true
      }
      return { ...newForms }

    case 'UPDATE_FORM':
      if (!newForms[action.formId]) {
        newForms[action.formId] = {}
      }
      if (
        !newForms[action.formId][action.fieldName] ||
        newForms[action.formId][action.fieldName] === ''
      ) {
        newForms[action.formId][action.fieldName] = {}
      }
      newForms[action.formId][action.fieldName].value = action.fieldValue
      return { ...newForms }

    default:
      return state
  }
}