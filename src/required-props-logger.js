/* Logs errors if required or recommended props are missing */

export function requiredPropsLogger(
  props,
  requiredProps = [],
  recommendedProps = [],
  oneOrOther = false
) {
  const { formData, name } = props
  const propKeys = Object.keys(props)

  const missingRequired = requiredProps.filter(
    field => propKeys.indexOf(field) === -1
  )

  const missingRecommended = recommendedProps.filter(
    field => propKeys.indexOf(field) === -1
  )

  const missingOneOrOther =
    oneOrOther &&
    (propKeys.indexOf('value') === -1 ||
      (formData && Object.keys(formData).indexOf(name) === -1))

  if (missingRequired.length) {
    console.log(
      `%c Missing required props in input with name ${name}: ${missingRequired.toString()}`,
      'color: red'
    )
  }

  if (missingOneOrOther) {
    console.log(
      `%c Missing either 'value' or 'formData' prop in input with name ${name}`,
      'color: red'
    )
  }

  if (missingRecommended.length) {
    console.log(
      `%c Missing recommended props in input with name ${name}: ${missingRecommended.toString()}`,
      'color: orange'
    )
  }
}
