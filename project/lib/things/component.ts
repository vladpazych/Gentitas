import { IContext } from './Context';
import toUpper from '../helpers/toUpper';
import * as helpers from './helpers';
import map from '../../map';

export interface IComponent {
    Prefix(value: string): this
    Contexts(...contexts: IContext[]): this
    GetClassName(): string
}

export class Component implements IComponent {
    name: string
    nameUpper: string
    className: string
    contexts: IContext[] = []
    single: boolean = false
    prefix: string
    fields: {}

    constructor(fields?: {}, name: string = "") {
        if (!name) this.name = helpers.Name();
        else this.name = name;
        this.nameUpper = helpers.ToUpper(this.name);
        this.className = toUpper(this.name) + "Component";
        if (fields) this.fields = fields;
    }

    Prefix(value: string) {
        this.prefix = value;
        return this;
    }

    Contexts(...contexts: IContext[]) {
        for (var key in contexts) {
            if (this.contexts.indexOf(contexts[key]) == -1) {
                this.contexts.push(contexts[key]);
                contexts[key].AddComponent(this);
            }
        }
        return this;
    }

    // 
    // Getters
    // 
    GetClassName() {
        return this.className;
    }
}



export interface IUcomponent extends IComponent { }

export class Ucomponent extends Component implements IUcomponent {
    constructor(fields?: {}, name: string = "") {
        super(fields, name);
        this.single = true;
    }
}



export function component(fields?: {}, name: string = ""): IComponent {
    var el = new Component(fields, name);
    map.Add('components', el);
    return el;
}

export function ucomponent(fields?: {}, name: string = ""): IUcomponent {
    var el = new Ucomponent(fields, name);
    map.Add('components', el);
    return el;
}