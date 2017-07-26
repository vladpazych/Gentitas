import map from '../../map'
import * as helpers from '../helpers/common'
import { IComp, Comp, comp } from './comp'
import { IGroup, Group, group } from './group'
import { INamable, Namable } from './namable'
import { IMatch, Match } from './match'

export interface IContext extends INamable {
}

export class Context extends Namable implements IContext {
  fakeEntityInterfacesValue: string[] = []
  entityTypeValue: string
  entityInterfaceValue: string
  moduledEntityTypeValue: string
  moduledEntityInterfaceValue: string
  compsValue: IComp[] = []
  indiciesValue: IComp[] = []
  isContextValue: boolean
  isFakeValue: boolean

  constructor(comps?: {}, isFake?: boolean, fakeContexts?: Array<{}>, name?: string) {
    super(name || '', isFake ? 'Fake' : '', 'Context')
    this.entityTypeValue = this.nameUpperValue + 'Entity'
    this.entityInterfaceValue = 'I' + this.nameUpperValue + 'Entity'
    this.moduledEntityTypeValue = this.moduleNameValue + '.' + this.entityTypeValue
    this.moduledEntityInterfaceValue = this.moduleNameValue + '.' + this.entityInterfaceValue
    this.isFakeValue = isFake

    this._fillComps(comps)

    if (fakeContexts) {
      fakeContexts.forEach((fakeContext) => {
        this._fillFakeComps(fakeContext)
      })
    }
  }

  private _fillFakeComps(comps) {
    for (let key in comps) {
      let comp = comps[key] as Comp

      if (this.compsValue.indexOf(comp) === -1) {
        this.compsValue.push(comp)
        let interfaceValue = (comp.contextValue as Context).moduledEntityInterfaceValue
        if (this.fakeEntityInterfacesValue.indexOf(interfaceValue) === -1) this.fakeEntityInterfacesValue.push(interfaceValue)
      }
    }
  }

  private _fillComps(comps?: {}) {
    for (let key in comps) {
      let comp = comps[key] as Comp
      let group = comps[key] as Group

      if (comp && comp.isCompValue) {
        comp.contextValue = this

        if (this.compsValue.indexOf(comp) === -1) {
          this.compsValue.push(comp)

          if (this.isFakeValue) comp.isFakeValue = true

          if (comp.indexValue) this.indiciesValue.push(comp)

          if (comp.groupValue) { group = comp.groupValue as Group }
        }
      }

      if (group && group.isGroupValue) {
        group.contextValue = this
      }
    }
  }
}

export function context<T, B>(comps?: T, ...fakeContext: B[]): T {
  let el = new Context(comps, false, fakeContext)
  map.AddModule(el.moduleNameValue, 'contexts', el)
  return comps
}

export function fakeContext<T>(comps?: T): T {
  let el = new Context(comps, true)
  map.AddModule(el.moduleNameValue, 'fakeContexts', el)
  return comps
}
