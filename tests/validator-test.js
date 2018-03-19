import { describe, it } from 'mocha'
import { validatorAggregator as validator } from '../src/validator.js'
import * as assert from 'assert'

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

const testData = {
  name: { value: '123', validateAs: 'not-empty', name: 'name'},
  limitedLength: { value: '123', validateAs: 'max-length-8', name: 'limitedLength'}
}

const testData2 = {
  multiValidate: { value: 'blahblahblahblah@email.com', validateAs: 'not-empty email', name: 'multiValidate' }
}

describe('validator.js', () => {
  it ('returns an object with isValid and warnings fields', async () => {
    const result = await validator(testData, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(result.isValid, true)
    assert.deepEqual(
      result.warnings,
      { name: null, limitedLength: null }
    )
  })

  it ('can validate multiple validateAs fields', async () => {
    const result = await validator(testData2, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(result.isValid, true)
    assert.deepEqual(
      result.warnings,
      {
        multiValidate: null
      }
    )

    const updatedTestData2 = { ...testData2 }
    updatedTestData2.multiValidate.validateAs = 'max-length-8 email'
    const result2 = await validator(updatedTestData2, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result2)
    assert.equal(result2.isValid, false)
    assert.deepEqual(
      result2.warnings,
      {
        multiValidate: validationHelp.errorLanguage['max-length-8'],
      }
    )
  })

  it ('returns a warning when a field is invalid', async () => {
    const newTestData = {...testData, limitedLength: { ...testData.limitedLength, value: '1234567890' }}
    const result = await validator(newTestData, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result)
    assert.equal(result.isValid, false)
    assert.deepEqual(
      result.warnings,
      {
        limitedLength: validationHelp.errorLanguage['max-length-8'],
        name: null
      }
    )

    newTestData.name.value = ''
    newTestData.limitedLength.value = '45'
    const result2 = await validator(newTestData, validationHelp.errorLanguage, validationHelp.dictionary)
    assert.ok(result2)
    assert.equal(result2.isValid, false)
    assert.deepEqual(
      result2.warnings,
      {
        name: validationHelp.errorLanguage['not-empty'],
        limitedLength: null
      }
    )
  })
})