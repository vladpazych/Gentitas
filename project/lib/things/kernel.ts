import map from '../../map'
import * as helpers from '../helpers/common'
import { IContract } from './contracts'
import { INamable, Namable } from './namable'

export interface IBaseKernel extends INamable {
  add(chain: {}): this
}

export class BaseKernel extends Namable implements IBaseKernel {
  contractsValue: Array<{}> = []
  choosableValue: boolean
  isKernelValue: boolean

  constructor(name?: string) {
    super(name || '', '', 'Kernel')
    this.isKernelValue = true
  }

  add(kernelOrContract: {}) {
    this.contractsValue.push(kernelOrContract)

    return this
  }
}

export interface IKernel extends IBaseKernel {
  choosable(value?: boolean): this
}

export class Kernel extends BaseKernel implements IKernel {
  constructor(name?: string) {
    super(name || '')
  }

  choosable(value: boolean = true) {
    this.choosableValue = value
    map.AddMeta(this.moduleNameValue, 'choosableKernels', this)
    return this
  }
}



//
// Partial
//
export interface IPartialKernel extends IBaseKernel {
}

export class PartialKernel extends BaseKernel implements IPartialKernel {
  isKernelPartialValue: boolean

  constructor(name?: string) {
    super(name || '')
    this.isKernelPartialValue = true
  }
}



export function kernel(): IKernel {
  let el = new Kernel()
  map.AddModule(el.moduleNameValue, 'kernels', el)
  return el
}

export function kernelPartial(): IKernel {
  let el = new Kernel()
  map.AddModule(el.moduleNameValue, 'partialKernels', el)
  return el
}
