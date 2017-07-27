import { module, kernel, fakeKernel, match, initializeContract, executeContract, reactiveContract, fakeReactiveContract, namespace } from '@lib'
import $this from './alias'
import { trash } from './contexts'

const logic = new (class {
  some = initializeContract()

  fakeContract = fakeReactiveContract()
    .enter(match.all(trash.trash))
})()

const kernels = new (class {
  main = fakeKernel()
    .add(logic.some)
})()

export default module($this, { trash }, kernels)
