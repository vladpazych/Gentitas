import { module, kernel, match, initializeContract, executeContract, reactiveContract, multiReactiveContract, namespace } from '@lib'
import $this from './alias'
import { state, input, event } from './contexts'


const logic = new (class {
  init = initializeContract()

  eventProcess = reactiveContract()
    .enter(match.all(state.application, event.event))

  multis = multiReactiveContract(state, input)
    .enter(match.all(event.event))

})()

const kernels = new (class {
  main = kernel()
    .add(logic.init)
    .add(logic.eventProcess)
})()

export default module($this, { state }, kernels)
