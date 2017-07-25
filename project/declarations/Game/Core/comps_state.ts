import { match, comp, group } from '@lib'
import $ from '@alias'
import $this from './alias'
import contexts from './contexts'

export default contexts.state.contextify(new (class {
  some = comp()
})())
