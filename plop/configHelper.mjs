import { getConstant } from '../constants.mjs'
import { getAllLinesFromFile } from './fileHelper.mjs'

export function loadConfig () {
  const config = {}
  const configLines = getAllLinesFromFile(getConstant('ALLCONFIGPATH'))

  if (configLines) {
    for (let i = 0; i < configLines.length; i++) {
      const splittedByEqual = configLines[i].split('=')
      if (splittedByEqual.length === 2 && splittedByEqual[0]) {
        const key = splittedByEqual[0]
        const value = splittedByEqual[1]
        config[key] = value
      }
    }
  } else {
    throw new Error(`config file ${getConstant('ALLCONFIGPATH')} not found`)
  }
  console.log('Config loaded', config)
  return config
}
