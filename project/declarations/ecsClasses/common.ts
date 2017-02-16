import { Matcher, ecsClass } from '../../lib/lib';
import alias from '../alias'
import contexts from '../contexts';
import components from '../components';
import interfacesCommon from '../ecsInterfaces/common'

class all {
    someService = ecsClass()
        .PropContext(contexts.core)
        .Implement(interfacesCommon.someDoable)
        .Method("DoSomeStuff", alias.void)
        .Comment("Some Comment for intellisense docs and HTML API Refence")
        .Ucomponent()

    someOtherService = ecsClass()
        .Inherit(this.someService.GetClassName())
        .Method("DoSomeMuchCoolerStuff", alias.void)
        .Ucomponent()
};

export default new all();