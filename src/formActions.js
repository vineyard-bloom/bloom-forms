/* form action creators */

export function addFormError(formId, fieldName, errorMsg) {
  return {
    type: 'ADD_FORM_ERROR',
    formId,
    fieldName,
    errorMsg
  }
}

export function clearForm(formId) {
  return {
    type: 'CLEAR_FORM',
    formId: formId
  }
}

export function deleteFormError(formId, fieldName, errorMsg) {
  return {
    type: 'DELETE_FORM_ERROR',
    formId,
    fieldName,
    errorMsg
  }
}

export function createForm(formId, formObject) {
  return {
    type: 'CREATE_FORM',
    formId,
    formObject
  }
}

export function updateForm(e, formId, fieldName, fieldValue, type) {
  fieldName = fieldName || ((e && e.target) ? e.target.getAttribute('name') : null)
  if (!fieldName || !formId) {
    console.log('missing either fieldName or formId')
    return { type: '' }
  }

  let reducerType = 'UPDATE_FORM'

  switch (type) {
    case 'checkbox':
      fieldValue = fieldValue || (e ? e.target.checked : false)
      break
    case 'file':
      fieldValue = fieldValue && fieldValue[0] ? fieldValue[0].name : ''
      reducerType = 'UPDATE_FORM_FILE'
      break
    case 'radio':
      if (e.target.checked) {
        fieldValue = fieldValue || (e ? e.target.id : '')
        break
      } else {
        return { type: '' }
        break
      }
    default:
      fieldValue = fieldValue || (e ? e.target.value : '')
  }

  return {
    type: reducerType,
    formId,
    fieldName,
    fieldValue
  }
}