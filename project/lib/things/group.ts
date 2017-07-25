import map from '../../map'
import * as helpers from '../helpers/common'
import { IContext } from './context'
import { IComp } from './comp'
import { Match, IMatch, match } from './match'
import { INamable, Namable } from './namable'

export interface IGroup extends INamable {
  single(value?: boolean): this
}

export class Group extends Namable implements IGroup {
  contextValue: IContext
  matchValue: IMatch
  singleValue: boolean = false

  constructor(match: IMatch, single: boolean = false, name: string = '') {
    super(name, '', 'Group')
    this.matchValue = match
    this.singleValue = single
  }

  single(value: boolean = true) {
    this.singleValue = value
    return this
  }
}

export function group(comp: IComp, name?: string): IGroup
export function group(match: IMatch, name?: string): IGroup
export function group(compOrMatch: any, name: string = ''): IGroup {
  let groupMatch = compOrMatch

  // If field from match is undefined - it is component
  if (compOrMatch['allOf'] === undefined) {
    groupMatch = match.all(compOrMatch)
  }

  let el = new Group(groupMatch, false, name)
  map.AddModule(el.moduleNameValue, 'groups', el)
  return el
}
