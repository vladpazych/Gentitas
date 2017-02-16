import { IComponent } from './component';
import * as helpers from './helpers';
import map from '../../map';

export interface IContext {
    AddComponent(IComponent): this
    GetEntityType(): string
}

export class Context implements IContext {
    name: string;
    nameUpper: string;
    components: IComponent[] = [];
    entityType: string;

    constructor() {
        this.name = helpers.Name();
        this.nameUpper = helpers.ToUpper(this.name);
        this.entityType = this.nameUpper + "Entity";
    }

    AddComponent(component: IComponent) {
        if (this.components.indexOf(component) == -1) this.components.push(component);
        return this;
    }

    // 
    // Getters
    // 
    GetEntityType() {
        return this.entityType;
    }
}



export function context(): IContext {
    var el = new Context();
    map.Add('contexts', el);
    return el;
}