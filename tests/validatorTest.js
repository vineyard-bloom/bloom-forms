import { validatorAggregator as validator } from '../src/validator.js';
import * as assert from 'assert';

const validationHelp = {
  dictionary: {
    'max-length-8': (testData) => testData.length > 8
      ? validationHelp.errorLanguage['max-length-8']
      : null
  },
  errorLanguage: {
    'max-length-8': 'This field cannot be more than 8 characters long.',
    'not-empty': 'This field cannot be empty!!!'
  }
}

const testDataObj = {
  name: { value: '123', validateAs: 'not-empty', name: 'name'},
  limitedLength: { value: '123', validateAs: 'max-length-8', name: 'limitedLength'}
}

const testDataObj2 = {
  multiValidate: { value: 'blah@email.com', validateAs: 'not-empty email', name: 'multiValidate' }
}

describe('validator.js', function() {
  it ('returns an object', async function() {
    const result = await validator(testDataObj, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(
      result.toString(),
      { isValid: true, warnings: {} }.toString()
    )
  })

  it ('can validate multiple validateAs fields', async function() {
    const result = await validator(testDataObj2, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(
      result.toString(),
      { isValid: true, warnings: {} }.toString()
    )

    testDataObj2.validateAs = 'email max-length-8'
    const result2 = await validator(testDataObj2, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result2)
    assert.equal(
      result2.toString(),
      { isValid: false, warnings: { multiValidate: validationHelp.errorLanguage['max-length-8'] } }.toString()
    )
  })

  it ('returns a warning when a field is invalid', async function() {
    testDataObj.limitedLength.value = '1234567890'
    const result = await validator(testDataObj, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(
      result.toString(),
      { isValid: false, warnings: { limitedLength: validationHelp.errorLanguage['max-length-8'] } }.toString()
    )

    testDataObj.name.value = ''
    testDataObj.limitedLength.value = '45'
    const result2 = await validator(testDataObj, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(
      result2.toString(),
      { isValid: false, warnings: { name: validationHelp.errorLanguage['not-empty'] } }.toString()
    )
  })
})