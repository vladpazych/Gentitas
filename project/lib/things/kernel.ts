import map from '../../map'
import * as helpers from '../helpers/common'
import { IContract, Contract } from './contracts'
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
    if (!(kernelOrContract as BaseKernel).isKernelValue && !(kernelOrContract as Contract).isContractValue) {
      helpers.messageRobot.message('Only kernel or contract can be added to kernel', this.moduledClassNameValue)
    }

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
export interface IKernelPartial extends IBaseKernel {
}

export class KernelPartial extends BaseKernel implements IKernelPartial {
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
  map.AddModule(el.moduleNameValue, 'KernelPartials', el)
  return el
}
