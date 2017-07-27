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
  isContractValue: boolean
  commentValue: string

  constructor(name?: string) {
    super(name || '', '', 'Contract')
    this.systemTypeValue = ''
    this.isContractValue = true
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
  isSpyValue: boolean

  constructor(name?: string) {
    super(name)
    this.systemTypeValue = 'Reactive'
  }

  //
  // Trigger
  //
  private trigger(match: IMatch, eventType: string) {
    this.triggersValue.push({ match, eventType })
    this._contextify(match)
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
  private _contextify(match: IMatch) {
    let m = match as Match

    if (m) {
      for (let i in m.combined) {
        let comp = (m.combined[i] as Comp)

        if (!this.contextValue && !comp.isFakeValue) {
          this.contextValue = (m.combined[i] as Comp).contextValue

          if (this.contextValue && this.moduleNameValue !== this.contextValue.moduleNameValue) {
            this.isSpyValue = true
          }
        }

        if (!comp.isFakeValue && comp.contextValue &&
          (comp.contextValue.nameValue !== this.contextValue.nameValue || comp.moduleNameValue !== this.contextValue.moduleNameValue)) {
          helpers.messageRobot.message('Context inconsistency in contract', this.moduledClassNameValue, comp.moduledClassNameValue)
        }
      }
    }
  }
}


export interface IMultiReactiveContract extends IExecuteContract {
  enter(match: IMatch): this
  left(match: IMatch): this
}

export class MultiReactiveContract extends ExecuteContract implements IMultiReactiveContract {
  contextsValue: Context[] = []
  triggersValue: Array<{ match: IMatch, eventType: string }> = []

  constructor(contexts: Array<{}>, name?: string) {
    super(name)
    this.systemTypeValue = 'MultiReactive'

    contexts.forEach((context) => {
      // Context here is a list of components, so we need to get real context from one of them
      let keys = Object.keys(context)
      for (let i in keys) {
        let key = keys[i]
        let comp = context[key] as Comp
        if (comp.isFakeValue) {
          helpers.messageRobot.message(
            'FakeContext can not be added to MultiReactiveContract',
            'Context: ' + comp.contextValue.classNameValue,
            'Contract: ' + this.classNameValue,
            'Module: ' + this.moduleNameValue,
            '',
            'Blocked')

          this.block(true)
          break
        }
      }
    })
  }

  //
  // Trigger
  //
  private trigger(match: IMatch, eventType: string) {
    this.triggersValue.push({ match, eventType })
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

export function multiReactiveContract(...contexts: Array<{}>): IMultiReactiveContract {
  let el = new MultiReactiveContract(contexts)
  map.AddModule(el.moduleNameValue, 'multiReactiveContracts', el, false)
  map.AddModule(el.moduleNameValue, 'contracts', el, false)
  return el
}
