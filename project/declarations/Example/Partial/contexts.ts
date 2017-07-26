import { context, fakeContext, match, comp, group } from '@lib'
import $ from '@alias'
import $this from './alias'

export const trash = fakeContext(new (class {
  trash = comp()
  trashValidated = comp()
})())
