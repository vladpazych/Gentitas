import { INamable } from './namable'

export default function namespace<T>(value: string, obj: T): T {
  for (let key in obj) {
    obj[key]['namespaceValue'] = value
  }

  return obj
}
