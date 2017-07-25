import { context, match, comp, group } from '@lib'
import $ from '@alias'
import $this from './alias'

export const state = context(new (class {
  someCool = comp()

  pther = comp()
  ddd = comp()
})())

export const input = context(new (class {
  pther = comp()
  ddd = comp()
})())
