import map from '../../map'
import * as helpers from '../helpers/common'
import * as path from 'path'
import EventType from './eventType'
import { INamable, Namable } from './namable'
import { IComp, Comp } from './comp'
import { IContext, Context } from './context'
import { IMatch, Match } from './match'

export interface IContract extends INamable {
  comment(value: string): this
}

export class Contract extends Namable implements IContract {
  systemTypeValue: string
  commentValue: string

  constructor(name?: string) {
    super(name || '', '', 'Contract')
    this.systemTypeValue = ''
  }

  //
  // Docs
  //
  comment(value: string) {
    this.commentValue = value
    return this
  }
}



//
// Initialize
//
export interface IInitializeContract extends IContract {
}

export class InitializeContract extends Contract implements IInitializeContract {
  constructor(name?: string) {
    super(name)
    this.systemTypeValue = 'Initialize'
  }
}



//
// Execute
//
export interface IExecuteContract extends IInitializeContract { }

export class ExecuteContract extends InitializeContract implements IInitializeContract {
  constructor(name?: string) {
    super(name)
    this.systemTypeValue = 'Execute'
  }
}



//
// Reactive
//
export interface IReactiveContract extends IExecuteContract {
  enter(match: IMatch): this
  left(match: IMatch): this
}

export class ReactiveContract extends ExecuteContract implements IReactiveContract {
  triggersValue: Array<{ match: IMatch, eventType: string }> = []
  contextValue: IContext
  spyValue: boolean

  constructor(name?: string) {
    super(name)
    this.systemTypeValue = 'Reactive'
  }

  //
  // Trigger
  //
  private trigger(match: IMatch, eventType: string) {
    this.triggersValue.push({ match, eventType })
    this.contextify(match)
    if (this.moduleNameValue !== this.contextValue.moduleNameValue) this.spyValue = true
    return this
  }

  enter(match: IMatch) {
    this.trigger(match, EventType.onEntered)
    return this
  }

  left(match: IMatch) {
    this.trigger(match, EventType.onLeft)
    return this
  }


  // Set context and check that all component in matcher are from same context
  private contextify(match: IMatch) {
    let m = match as Match

    if (m) {
      for (let i in m.combined) {
        let comp = (m.combined[i] as Comp)

        if (!this.contextValue && !comp.isUniversalValue) {
          this.contextValue = (m.combined[i] as Comp).contextValue
        }

        if (!comp.isUniversalValue && comp.contextValue.nameValue !== this.contextValue.nameValue) {
          console.log('Context inconsistency in contract ' + this.moduleNameValue + '.' + this.nameValue, comp.nameValue)
        }
      }
    }
  }
}



export function initializeContract(): IInitializeContract {
  let el = new InitializeContract()
  map.AddModule(el.moduleNameValue, 'initializeContracts', el, false)
  map.AddModule(el.moduleNameValue, 'contracts', el, false)
  return el
}

export function executeContract(): IExecuteContract {
  let el = new ExecuteContract()
  map.AddModule(el.moduleNameValue, 'executeContracts', el, false)
  map.AddModule(el.moduleNameValue, 'contracts', el, false)
  return el
}

export function reactiveContract(): IReactiveContract {
  let el = new ReactiveContract()
  map.AddModule(el.moduleNameValue, 'reactiveContracts', el, false)
  map.AddModule(el.moduleNameValue, 'contracts', el, false)
  return el
}
