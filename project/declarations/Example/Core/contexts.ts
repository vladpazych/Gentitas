import { context, fakeContext, match, comp, group } from '@lib'
import $ from '@alias'
import $this from './alias'

export const event = fakeContext(new (class {
  event = comp()
  processed = comp()
  index = comp($.int)
})())

export const state = context(new (class {
  application = comp().groupSingle()
  level = comp($.int).index()
})(), event)

export const input = context(new (class {
})())
