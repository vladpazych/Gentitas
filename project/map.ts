/*
 *
 * It looks scary as shit, but it's very simple logic.
 * 1. When you create something from 'project/lib/things', using method, like comp(), initializeContract(),
 *    it will add itself to this global object, to specific module (which is path from 'project/declaractions').
 * 2. All templates use this global map object to get data to fill placeholder.
 *
 * That's it.
 *
 */

class Globals {
  AddMeta(moduleKey: string, key: string, namable: { nameValue: string }, override?: boolean) {
    if (override === undefined) override = true

    if (!this['meta']) this['meta'] = {}
    if (!this['meta'][key]) this['meta'][key] = {}
    if (!this['meta'][key][moduleKey]) this['meta'][key][moduleKey] = {}

    if (this['meta'][key][moduleKey][namable.nameValue] && override) {
      console.warn('Overriding ' + namable.nameValue + ' in ' + key + ' |', namable)
      this['meta'][key][moduleKey][namable.nameValue] = namable
    } else if (!this['meta'][key][moduleKey][namable.nameValue]) {
      this['meta'][key][moduleKey][namable.nameValue] = namable
    } else {
      // If same object exists and override is diabled - add hash to make key unique
      this['meta'][key][moduleKey][namable.nameValue + '_' + Date.now()] = namable
    }
  }

  AddModule(moduleKey: string, key: string, namable: { nameValue: string }, override?: boolean) {
    if (override === undefined) override = true

    if (!this['modules']) this['modules'] = {}
    if (!this['modules'][moduleKey]) this['modules'][moduleKey] = {}
    if (!this['modules'][moduleKey][key]) this['modules'][moduleKey][key] = {}

    if (this['modules'][moduleKey][key][namable.nameValue] && override) {
      console.warn('Overriding ' + namable.nameValue + ' in ' + key + ' |', namable)
      this['modules'][moduleKey][key][namable.nameValue] = namable
    } else if (!this['modules'][moduleKey][key][namable.nameValue]) {
      this['modules'][moduleKey][key][namable.nameValue] = namable
    } else {
      // If same object exists and override is diabled - add hash to make key unique
      this['modules'][moduleKey][key][namable.nameValue + '_' + Date.now()] = namable
    }
  }

  RemoveModule(moduleKey: string, key: string) {
    if (this['modules'][moduleKey] !== undefined && this['modules'][moduleKey][key] !== undefined) delete this['modules'][moduleKey][key]
  }

  RemoveMeta(moduleKey: string, key: string) {
    if (this['meta'][key] !== undefined && this['meta'][key][moduleKey] !== undefined) delete this['meta'][key][moduleKey]
  }
}

export default new Globals()
