import { module, kernel, match, initializeContract, executeContract, reactiveContract, namespace } from '@lib'
import $this from './alias'
import { trash } from './contexts'

const logic = new (class {
  some = initializeContract()
})()

const kernels = new (class {
  main = kernel()
    .add(logic.some)
})()

export default module($this, { trash }, kernels)
