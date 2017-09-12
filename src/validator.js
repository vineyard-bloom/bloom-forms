import language from 'language'

// pass in a dict of field / value pairs to the aggregator as testDataObject
export function validatorAggregator(testDataObject = {}, errorLanguage=null, optDict=null) {
  let status = { isValid: true, warnings: {}}

  const dict = {
    'date': dateError,
    'email': emailError,
    'file': fileError,
    'name': nameError,
    'not-empty': notEmptyError,
    'number': numberError,
    'number-field': numberFieldError,
    'phone': phoneError,
    'zip': zipError,
    ...optDict
  }

  for (let field in testDataObject) {
    let thisField = testDataObject[field]
    if (thisField.validateAs) {
      status = validate(status, thisField.value, thisField.validateAs, thisField.name, dict, errorLanguage)
    }
  }

  return status
}

const validate = (prevStatus, testData, validateAs, fieldName, dict, errorLanguage) => {
  if (fieldName.indexOf('confirm') > -1) {
    // find its partner and test against it
    const partnerName = fieldName.replace('confirm', '')
    const partner = document.getElementById(partnerName[0].toLowerCase().concat(partnerName.slice(1)))
    if (partner.value != testData) {
      prevStatus.isValid = prevStatus.isValid && false
      prevStatus.warnings[fieldName] = errorLanguage ? errorLanguage['dont-match'].replace('<FIELD>', partnerName) : `${partnerName}s must match.`
    } else {
      isValid = prevStatus.isValid && true
    }
  }

  let error = dict[validateAs](testData, fieldName, errorLanguage)
  prevStatus.warnings[fieldName] = error

  // if (!error) {
  //   delete prevStatus.warnings[fieldName]
  // }

  return { ...prevStatus, isValid: prevStatus.isValid && !error }
}

function dateError(testData, fieldName, errorLanguage) {
  // const dateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
  // return dateRegex.test(testData) ? null : errorLanguage ? errorLanguage['invalid-date']
  return new Date(testData) ? null : errorLanguage ? errorLanguage['invalid-date'] : 'Please enter a valid date.'
}

function emailError(testData, fieldName, errorLanguage) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(testData) ? null : errorLanguage ? errorLanguage['invalid-email'] : 'Please enter a valid email.'
}

function fileError(testData, fieldName, errorLanguage) {
  return testData.files && testData.files[0] && (testData.files[0].size > 100000)
    ? errorLanguage ? errorLanguage['file-size'] : 'Maximum file size exceeded.'
    : null
}

function nameError(testData, fieldName, errorLanguage) {
  return testData.length < 2
    ? errorLanguage ? errorLanguage['min-length'].replace('<FIELD>', fieldName).replace('<LIMIT>', '2') : `${fieldName} must be at least 2 characters.`
    : null
}

function notEmptyError(testData, fieldName, errorLanguage) {
  return !testData && (testData !== 0)
    ? errorLanguage ? errorLanguage['empty-field'].replace('<FIELD>', fieldName) : `${fieldName} cannot be empty.`
    : null
}

function numberError(testData, fieldName, errorLanguage) {
  return !testData || !(/^[0-9]+$/.test(testData))
    ? errorLanguage ? errorLanguage['invalid-number'] : 'Please enter a valid number.'
    : null
}

function numberFieldError(testData, fieldName, errorLanguage) {
  return !testData || !(/^[0-9]+$/.test(testData))
    ? errorLanguage ? errorLanguage['invalid-field'].replace('<FIELD>', fieldName) : `${fieldName} is invalid.`
    : null
}

function phoneError(testData, fieldName, errorLanguage) {
  if (testData.length < 8) {
    return errorLanguage
      ? errorLanguage['min-length'].replace('<FIELD>', language.fieldLabels.phoneNumber).replace('<LIMIT>', '8')
      : `${fieldName} must be at least 8 chars.`
  } else if (testData.length > 15) {
    return errorLanguage
      ? errorLanguage['max-length'].replace('<FIELD>', language.fieldLabels.phoneNumber).replace('<LIMIT>', '15')
      : `${fieldName} cannot exceed 15 chars.`
  } else {
    return null
  }
}

function zipError(testData, fieldName, errorLanguage) {
  const usZipRegex = /^\d{5}(?:[-\s]\d{4})?$/
  return usZipRegex.test(testData)
    ? null
    : errorLanguage
      ? errorLanguage['invalid-field'].replace('<FIELD>', language.fieldLabels.zip)
      : 'Please enter a valid postal code.'
}