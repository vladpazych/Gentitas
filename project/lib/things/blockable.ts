import map from '../../map'
import * as helpers from '../helpers/common'
import { Context, IContext } from './context'
import * as path from 'path'

export interface IBlockable {
  isBlockedValue: boolean
}

export class Blockable implements IBlockable {
  isBlockedValue: boolean

  block(value: boolean) {
    this.isBlockedValue = value
    return this
  }
}
