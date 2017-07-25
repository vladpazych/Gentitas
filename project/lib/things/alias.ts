import { INamable } from './namable'
import * as helpers from '../helpers/common'
import * as path from 'path'

/**
 * Function for creating local aliases.
 * '@' character will point to the current module.
 * For example, '@Scripts.Some' will be converted to 'YourGlobal.YourModule.Scripts.Some'
 * This namespace based on path of your module here, in Gentitas, starting from 'project/declarations'
 */
export default function alias<T extends {}>(obj: T): T {
  let fileNameValue = helpers.FileName()
  let folderNameArr = fileNameValue.split(path.sep)
  let folderName = folderNameArr[folderNameArr.length - 2]

  let indexOfRoot = folderNameArr.indexOf('declarations') + 1
  let moduleName = ''

  for (let i = indexOfRoot; i < folderNameArr.length - 1; i++) {
    moduleName += folderNameArr[i]
    if (i !== folderNameArr.length - 2) moduleName += '.'
  }

  let moduleNameValue = moduleName
  let moduleNameRefValue = 'global::' + moduleName
  let moduleNameMergedValue = moduleName.replace(/\./g, '')

  for (let key in obj) {
    if (typeof (obj[key]) === 'string') {
      let field = obj[key] as string

      if (field && field.indexOf('@') !== -1) {
        field = field.replace('@', '')
        field = moduleNameRefValue + '.' + field
      }

      obj[key] = field
    } else {
      obj[key] = alias(obj[key])
    }
  }

  return obj
}
