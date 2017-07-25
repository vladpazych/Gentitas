import map from '../../map'
import * as helpers from '../helpers/common'
import { IComp, Comp, comp } from './comp'
import { IGroup, Group, group } from './group'
import { INamable, Namable } from './namable'
import { IMatch, Match } from './match'

export interface IContext extends INamable {
  readonly entityTypeValue: string
}

export class Context extends Namable implements IContext {
  entityInterfacesValue: string[] = []
  entityTypeValue: string
  compsValue: IComp[] = []
  indiciesValue: IComp[] = []

  constructor(comps?: {}, name?: string) {
    super(name || '', '', 'Context')
    this.entityTypeValue = this.nameUpperValue + 'Entity'

    for (let key in comps) {
      this.compsValue.push(comps[key])
    }
  }
}

export function context<T>(comps?: T): T {
  let el = new Context(comps)
  map.AddModule(el.moduleNameValue, 'contexts', el)
  return comps
}



// // Injects itself to components and groups as context
//   // and add all those components to this.components
//   contextify<T>(comps: T): T {
//     let c = comps as {}
//     if (c) {
//       for (let key in c) {
//         let ccomp = c[key] as Comp
//         let cgroup = c[key] as Group
//         if (ccomp) {
//           if (this.compsValue.indexOf(ccomp) !== -1) continue

//           // If it is universal it should keep it's data
//           ccomp.contextValue = this

//           if (ccomp.isUniversalValue) {
//             // It's a dirty hack, but I am fucking tired. Will fix later.
//             // If you see this, I probably forgot about it. Sorry dude, or gal...
//             let interfaceName = ccomp.moduleNameRefValue + '.IEntity'
//             if (this.entityInterfacesValue.indexOf(interfaceName) === -1) this.entityInterfacesValue.push(interfaceName)
//           }

//           this.compsValue.push(ccomp)

//           if (ccomp.indexValue) {
//             this.indiciesValue.push(ccomp)
//           }

//           if (ccomp.groupValue) {
//             let ccompGroup = ccomp.groupValue as Group
//             ccompGroup.contextValue = this
//           }
//         } else if (cgroup) cgroup.contextValue = this
//       }
//     }

//     return comps
//   }

//   universify<T>(comps: T): T {
//     let c = comps as {}
//     if (c) {
//       for (let key in c) {
//         let ccomp = c[key] as Comp
//         let cgroup = c[key] as Group
//         if (ccomp) {
//           ccomp.contextValue = this
//           if (this.compsValue.indexOf(ccomp) !== -1) continue

//           this.compsValue.push(ccomp)
//           ccomp.isUniversalValue = true

//           if (ccomp.indexValue) {
//             this.indiciesValue.push(ccomp)
//           }

//           if (ccomp.groupValue) {
//             let ccompGroup = ccomp.groupValue as Group
//             ccompGroup.contextValue = this
//           }
//         } else if (cgroup) cgroup.contextValue = this
//       }
//     }

//     return comps
//   }