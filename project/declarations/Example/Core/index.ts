import { module, kernel, match, initializeContract, executeContract, reactiveContract, namespace } from '@lib'
import $this from './alias'
import { state } from './contexts'

const logic = new (class {
  some = initializeContract()
})()

export default module(
  $this,
  { state },
  new (class {
    main = kernel()
      .add(logic.some)
  })()
)
