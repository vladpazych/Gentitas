import { kernel, match, initializeContract, executeContract, reactiveContract, namespace } from '@lib'
import scomps from './comps_state'

const contracts = new (class {
  some = initializeContract()
})()

export default new (class {
  main = kernel().choosable()
})()
