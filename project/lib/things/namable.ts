import map from '../../map'
import * as helpers from '../helpers/common'
import { Context, IContext } from './context'
import { Blockable, IBlockable } from './blockable'
import * as path from 'path'

export interface INamable extends IBlockable {
  readonly nameValue: string
  readonly nameUpperValue: string
  readonly namespaceValue: string
  readonly fileNameValue: string
  readonly moduleNameValue: string
  readonly classNameValue: string
  readonly interfaceNameValue: string
}

export class Namable extends Blockable implements INamable {
  nameValue: string
  nameUpperValue: string
  namespaceValue: string
  classNameValue: string
  interfaceNameValue: string
  moduleNameValue: string
  moduleNameShortValue: string
  moduleNameMergedValue: string
  moduledClassNameValue: string
  moduledInterfaceNameValue: string
  fileNameValue: string

  constructor(name?: string, nameSuffix?: string, classSuffix?: string, interfaceSuffix?: string) {
    super()
    
    this.nameValue = name || helpers.Name() + (nameSuffix || '')
    this.fileNameValue = helpers.FileName()
    this.nameUpperValue = helpers.toUpper(this.nameValue)
    this.classNameValue = helpers.toUpper(this.nameValue) + (classSuffix || '')
    this.interfaceNameValue = 'I' + this.classNameValue + (interfaceSuffix || '')

    let folderNameArr = this.fileNameValue.split(path.sep)
    let folderName = folderNameArr[folderNameArr.length - 2]

    let indexOfRoot = folderNameArr.indexOf('declarations') + 1
    let moduleName = ''

    for (let i = indexOfRoot; i < folderNameArr.length - 1; i++) {
      moduleName += folderNameArr[i]
      if (i !== folderNameArr.length - 2) moduleName += '.'
      else this.moduleNameShortValue = folderNameArr[i]
    }

    this.moduleNameValue = moduleName
    this.moduleNameMergedValue = moduleName.replace(/\./g, '')
    this.moduledClassNameValue = this.moduleNameValue + '.' + this.classNameValue
    this.moduledInterfaceNameValue = this.moduleNameValue + '.' + this.interfaceNameValue
  }
}
