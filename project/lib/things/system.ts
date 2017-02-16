import { IContext} from './context';
import { IComponent, IUcomponent } from './component'
import Matcher from './matcher';
import toUpper from '../helpers/toUpper';
import * as helpers from './helpers';
import map from '../../map';

export interface ISystem {
    Comment(value: string): this
    Chained(): this
}

export class System implements ISystem {
    name: string
    nameUpper: string
    type: string
    // File name for grouping by file in generated docs
    fileName: string
    className: string
    comment: string
    chained: boolean

    constructor() {
        this.name = helpers.Name();
        this.nameUpper = helpers.ToUpper(this.name);
        this.fileName = helpers.FileName();
        this.className = toUpper(this.name) + "System";
        this.type = "";
    }

    //
    // Docs
    //
    Comment(value: string) {
        this.comment = value;
        return this;
    }

    // 
    // Helpers
    // 
    Chained() {
        this.chained = true;
        return this;
    }
}



export interface IInitializeSystem extends ISystem {
    PropEntity(context: IContext, ucomponent: IUcomponent): this
    PropGroup(context: IContext, matcher: Matcher, name: string)
    PropGroupSingle(context: IContext, matcher: Matcher, name: string): this
    PropContext(context: IContext): this
}

export class InitializeSystem extends System implements IInitializeSystem {
    context: IContext
    propsEntity: { context: IContext, ucomponent: IUcomponent }[] = []
    propsGroup: { context: IContext, matcher: Matcher, name: string }[] = []
    propsGroupSingle: { context: IContext, matcher: Matcher, name: string }[] = []
    propsContext: IContext[] = []

    constructor(context: IContext) {
        super();
        this.context = context;
        this.type = "Initialize";
    }

    //
    // Props
    //
    PropEntity(context: IContext, ucomponent: IUcomponent) {
        this.propsEntity.push({ context: context, ucomponent: ucomponent });
        return this;
    }

    PropGroup(context: IContext, matcher: Matcher, name: string) {
        this.propsGroup.push({ context: context, matcher: matcher, name: name });
        return this;
    }

    PropGroupSingle(context: IContext, matcher: Matcher, name: string) {
        this.propsGroupSingle.push({ context: context, matcher: matcher, name: name });
        return this;
    }

    PropContext(context: IContext) {
        this.propsContext.push(context);
        return this;
    }
}



export interface IExecuteSytem extends IInitializeSystem { }

export class ExecuteSystem extends InitializeSystem implements IInitializeSystem {
    constructor(context: IContext) {
        super(context);
        this.type = "Execute";
    }
}



export interface IReactiveSystem extends IExecuteSytem {
    Trigger(matcher: Matcher, eventType: string): this
    Ensure(...components: IComponent[]): this
    Exclude(...components: IComponent[]): this
    BunchEntities(value?: boolean): this
    Filter(value?: boolean): this
}

export class ReactiveSystem extends ExecuteSystem implements IReactiveSystem {
    triggers: { matcher: Matcher, eventType: string }[] = []
    ensure: IComponent[] = []
    exclude: IComponent[] = []
    filter: boolean = false
    bunchEntities: boolean = false

    constructor(context: IContext) {
        super(context);
        this.type = "Reactive";
    }

    //
    // Trigger
    //
    Trigger(matcher: Matcher, eventType: string) {
        this.triggers.push({ matcher, eventType });
        return this;
    }

    //
    // Filter
    //
    Ensure(...components: IComponent[]) {
        for (var component of components) {
            this.ensure.push(component);
        }
        return this;
    }

    Exclude(...components: IComponent[]) {
        for (var component of components) {
            this.exclude.push(component);
        }
        return this;
    }

    //
    // Options
    //
    BunchEntities(value?: boolean) {
        this.bunchEntities = value == undefined ? true : value;
        return this;
    }

    Filter(value?: boolean) {
        this.filter = value == undefined ? true : value;
        return this;
    }
}



export interface IChainSystem extends ISystem {
    Add(...systems: System[]): this
}

export class ChainSystem extends System implements IChainSystem {
    systems: ISystem[] = []

    constructor(systems: ISystem[]) {
        super();

        for (var i = 0; i < systems.length; i++) {
            this.systems.push(systems[i]);
            systems[i].Chained();
        }
    }

    Add(...systems: ISystem[]) {
        for (var i = 0; i < systems.length; i++) {
            this.systems.push(systems[i]);
            systems[i].Chained();
        }

        return this;
    }
}



export function initializeSystem(context: IContext): IInitializeSystem {
    var el = new InitializeSystem(context);
    map.Add('initializeSystems', el);
    map.Add('systems', el);
    return el;
}

export function reactiveSystem(context: IContext): IReactiveSystem {
    var el = new ReactiveSystem(context);
    map.Add('reactiveSystems', el);
    map.Add('systems', el);
    return el;
}

export function executeSystem(context: IContext): IExecuteSytem {
    var el = new ExecuteSystem(context);
    map.Add('executeSystems', el);
    map.Add('systems', el);
    return el;
}

export function chainSystem(...systems: ISystem[]): IChainSystem {
    var el = new ChainSystem(systems);
    map.Add('chains', el);
    return el;
}