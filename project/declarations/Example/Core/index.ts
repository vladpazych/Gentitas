import { module, kernel, match, initializeContract, executeContract, reactiveContract, namespace } from '@lib'
import $this from './alias'
import { state, input, event } from './contexts'


const logic = new (class {
  init = initializeContract()

  eventProcess = reactiveContract()
    .enter(match.all(state.application, event.event))

})()

const kernels = new (class {
  main = kernel()
})()

export default module($this, { state }, kernels)
