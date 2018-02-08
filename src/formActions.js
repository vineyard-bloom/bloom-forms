/* form action creators */

export function addFormError(formId, fieldName, errorMsg) {
  return {
    type: 'ADD_FORM_ERROR',
    formId,
    fieldName,
    errorMsg
  }
}

export function checkCompleted(formId) {
  return {
    type: 'CHECK_COMPLETED',
    formId
  }
}

export function checkMultipleFields(formId, fieldNames) {
  return {
    type: 'TRIGGER_MULTIPLE_CHECK',
    formId,
    fieldNames
  }
}

export function clearForm(formId) {
  return {
    type: 'CLEAR_FORM',
    formId: formId
  }
}

export function checkForVisibleFields(formId) {
  return {
    type: 'CHECK_FOR_VISIBLE_FIELDS',
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

export function updateVisibleFieldsArr(formId, fields) {
  return {
    type: 'UPDATE_VISIBLE_FIELDS_ARR',
    formId,
    fields
  }
}

export function onFocus(formId, fieldName) {
  return {
    type: 'ON_FOCUS',
    formId,
    fieldName
  }
}

export function updateForm(
  e,
  formId,
  fieldName,
  fieldValue,
  type,
  multipleFiles
) {
  fieldName =
    fieldName || (e && e.target ? e.target.getAttribute('name') : null)
  const multiple = multipleFiles ? multipleFiles : ''
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
      fieldValue = fieldValue || ''
      reducerType = 'UPDATE_FORM_FILE'
      break
    case 'radio':
      if (e.target.checked) {
        fieldValue = fieldValue || (e ? e.target.id : '')
        break
      } else {
        return { type: '' }
      }
    default:
      fieldValue =
        fieldValue || (fieldValue === 0 ? fieldValue : e ? e.target.value : '')
  }

  return {
    type: reducerType,
    formId,
    fieldName,
    fieldValue,
    multiple
  }
}
