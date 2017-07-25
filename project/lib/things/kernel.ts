import map from '../../map'
import * as helpers from '../helpers/common'
import { IContract } from './contracts'
import { INamable, Namable } from './namable'

export interface IKernel extends INamable {
  add(chain: {}): this
  choosable(value?: boolean): this
}

export class Kernel extends Namable implements IKernel {
  contractsValue: Array<{}> = []
  choosableValue: boolean
  kernelValue: boolean
  isUniversalValue: boolean

  constructor() {
    super('', '', 'Kernel')
    this.kernelValue = true
  }

  add(chain: {}) {
    this.contractsValue.push(chain)

    return this
  }

  choosable(value: boolean = true) {
    this.choosableValue = value
    map.AddMeta(this.moduleNameValue, 'choosableKernels', this)
    return this
  }
}

export function kernel(): IKernel {
  let el = new Kernel()
  map.AddModule(el.moduleNameValue, 'kernels', el)
  return el
}
