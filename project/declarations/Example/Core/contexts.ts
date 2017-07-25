import { context, match, comp, group } from '@lib'
import $ from '@alias'
import $this from './alias'

export const state = context(new (class {
  someCool = comp().group()
  someCool2 = comp().group()

  pther = comp($.float).index()
  ddd = comp($.float).indexUnique()
  yo = comp().group()
  yo2 = comp().groupSingle()

  some = group(this.ddd)
})())

export const input = context(new (class {
  pther342 = comp()
})())
