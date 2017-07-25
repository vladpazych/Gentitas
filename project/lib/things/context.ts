import map from '../../map'
import * as helpers from '../helpers/common'
import { IComp, Comp, comp } from './comp'
import { IGroup, Group, group } from './group'
import { INamable, Namable } from './namable'
import { IMatch, Match } from './match'

export interface IContext extends INamable {
  readonly entityTypeValue: string
}

export class Context extends Namable implements IContext {
  entityInterfacesValue: string[] = []
  entityTypeValue: string
  compsValue: IComp[] = []
  indiciesValue: IComp[] = []

  constructor(comps?: {}, name?: string) {
    super(name || '', '', 'Context')
    this.entityTypeValue = this.nameUpperValue + 'Entity'

    for (let key in comps) {
      let comp = comps[key] as Comp
      let group = comps[key] as Group

      if (comp.isCompValue) {
        comp.contextValue = this

        if (this.compsValue.indexOf(comp) === -1) {
          this.compsValue.push(comp)

          if (comp.indexValue) this.indiciesValue.push(comp)

          if (comp.groupValue) { group = comp.groupValue as Group }
        }
      }

      if (group.isGroupValue) {
        group.contextValue = this
      }
    }
  }
}

export function context<T>(comps?: T): T {
  let el = new Context(comps)
  map.AddModule(el.moduleNameValue, 'contexts', el)
  return comps
}
