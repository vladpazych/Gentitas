import map from '../../map'
import * as helpers from '../helpers/common'
import { IContract } from './contracts'
import { INamable, Namable } from './namable'

export interface IModule<T, C, K> extends INamable {
  readonly alias: T
  readonly contexts: C
  readonly kernels: K
}

export class Module<T, C, K> extends Namable implements IModule<T, C, K> {
  alias: T
  contexts: C
  kernels: K

  constructor(alias: T, contexts: C, kernels: K, name?: string) {
    super(name || '', '', 'Kernel')

    this.alias = alias
    this.contexts = contexts
    this.kernels = kernels
  }
}



export function module<T, C, K>(alias: T, contexts: C, kernels: K): { alias: T, contexts: C, kernels: K } {
  return { alias, contexts, kernels }
}
