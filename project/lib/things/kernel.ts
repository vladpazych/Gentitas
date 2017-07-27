import map from '../../map'
import * as helpers from '../helpers/common'
import { IContract, Contract, ReactiveContract, FakeReactiveContract } from './contracts'
import { INamable, Namable } from './namable'
import { IContext, Context } from './context'

export interface IBaseKernel extends INamable {
  add(chain: {}): this
  implement(kernelOrContract: {}, context: {}): this
}

export class BaseKernel extends Namable implements IBaseKernel {
  contractsValue: Array<{}> = []
  choosableValue: boolean
  isKernelValue: boolean
  isFakeKernelValue: boolean = false

  constructor(name?: string) {
    super(name || '', '', 'Kernel')
    this.isKernelValue = true
  }

  add(kernelOrContract: {}) {
    if (!(kernelOrContract as BaseKernel).isKernelValue && !(kernelOrContract as Contract).isContractValue) {
      helpers.messageRobot.message('Only kernel or contract can be added to kernel', this.moduledClassNameValue)
      this.block(true)
    }

    let contract = kernelOrContract as Contract
    let kernel = kernelOrContract as BaseKernel

    if (contract && contract.isContractValue) {
      let fakeReactiveContract = contract as FakeReactiveContract

      if (!this.isFakeKernelValue && fakeReactiveContract && fakeReactiveContract.isFakeReactiveContract) {
        helpers.messageRobot.message(
          `Fake contract can not be added to non-fake kernel. 
                   You should use .implement() instead of .add()`,
          this.moduledClassNameValue,
          fakeReactiveContract.moduledClassNameValue)
      }
    }

    if (kernel && kernel.isKernelValue) {
      let fakeKernel = kernel as FakeKernel

      if (fakeKernel && fakeKernel.isFakeKernelValue) {
        helpers.messageRobot.message(
          `Fake kernel can not be added to non-fake kernel. 
                  You should use .implement() instead of .add()`,
          this.moduledClassNameValue,
          fakeKernel.moduledClassNameValue)
      }
    }

    this.contractsValue.push(kernelOrContract)

    return this
  }

  implement(kernelOrContract: {}, context: {}) {
    return this
  }

  onAdd(kernelOrContract: {}) { }
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

  implement(kernelOrContract: {}, context: {}) {
    if (!(kernelOrContract as BaseKernel).isKernelValue && !(kernelOrContract as Contract).isContractValue) {
      helpers.messageRobot.message('Only kernel or contract can be implemented', this.moduledClassNameValue)
      this.block(true)
    }

    if (this.isFakeKernelValue) {
      helpers.messageRobot.message(
        `You can not implement contract or kernel from fake kernel`,
        this.moduledClassNameValue)
    }

    let contract = kernelOrContract as Contract
    let kernel = kernelOrContract as BaseKernel

    if (contract && contract.isContractValue) {
      let fakeReactiveContract = contract as FakeReactiveContract

      if (!fakeReactiveContract.isFakeReactiveContract) {
        helpers.messageRobot.message(
          `You can not implement non-fake contract. 
                  Use .add() instead of .implement()`,
          this.moduledClassNameValue,
          contract.moduledClassNameValue)
      }

      fakeReactiveContract.implement(context)
    }

    if (kernel && kernel.isKernelValue) {
      let fakeKernel = kernel as FakeKernel

      if (!fakeKernel.isFakeKernelValue) {
        helpers.messageRobot.message(
          `You can not implement non-fake kernel. 
                  Use .add() instead of .implement()`,
          this.moduledClassNameValue,
          contract.moduledClassNameValue)
      }

      let contracts = fakeKernel.contractsValue
      for (let fakeKernelContract of contracts) {
        let fakeContract = (fakeKernelContract as FakeReactiveContract)
        if (fakeContract.isFakeReactiveContract) fakeContract.implement(context)
      }
    }

    this.contractsValue.push(kernelOrContract)

    return this
  }
}



//
// Partial
//
export interface IFakeKernel extends IBaseKernel {
}

export class FakeKernel extends BaseKernel implements IFakeKernel {
  implementationContextsValue: IContext[] = []
  isFakeKernelValue: boolean

  constructor(name?: string) {
    super(name || '')
    this.isFakeKernelValue = true
  }

  implement(kernelOrContract: {}, context: {}) {
    let keys = Object.keys(context)
    let ctx = context[keys[0]].contextValue

    if (this.implementationContextsValue.indexOf(ctx) === -1) this.implementationContextsValue.push(ctx)

    for (let contract of this.contractsValue) {
      let fakeContract = (contract as FakeReactiveContract)
      if (fakeContract && fakeContract.isFakeReactiveContract) fakeContract.implement(ctx)
    }

    return this
  }
}



export function kernel(): IKernel {
  let el = new Kernel()
  map.AddModule(el.moduleNameValue, 'kernels', el)
  return el
}

export function fakeKernel(): IFakeKernel {
  let el = new FakeKernel()
  map.AddModule(el.moduleNameValue, 'fakeKernels', el)
  return el
}
