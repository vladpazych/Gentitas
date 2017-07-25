import { IComp } from './comp'

export interface IMatch {
  all(...components: IComp[]): IMatch
  any(...components: IComp[]): IMatch
  none(...components: IComp[]): IMatch
}

export class Match implements IMatch {
  allOf: IComp[] = []
  anyOf: IComp[] = []
  noneOf: IComp[] = []
  combined: IComp[] = []

  all(...components: IComp[]): IMatch {
    for (let component of components) {
      this.allOf.push(component)
      this.combined.push(component)
    }

    return this
  }

  any(...components: IComp[]): IMatch {
    for (let component of components) {
      this.anyOf.push(component)
      this.combined.push(component)
    }

    return this
  }

  none(...components: IComp[]): IMatch {
    for (let component of components) {
      this.noneOf.push(component)
      this.combined.push(component)
    }

    return this
  }
}

export const match: IMatch = {
  all: (...components: IComp[]) => {
    let that = new Match()
    that.all(...components)
    return that
  },
  any: (...components: IComp[]) => {
    let that = new Match()
    that.all(...components)
    return that
  },
  none: (...components: IComp[]) => {
    let that = new Match()
    that.all(...components)
    return that
  },
}
