import { Context } from './context';
import { IComponent, IUcomponent, Component, Ucomponent, component, ucomponent } from './component';
import toUpper from '../helpers/toUpper';
import * as helpers from './helpers';
import map from '../../map';

export interface IECSInterface {
    Comment(value: string): this
    Implement(this: this, value: ECSInterface): this
    Implement(this: this, value: string): this
    Implement(this: this, value: any): this
    Method(name: string, ret: string, ...fields: {}[]): this
    Component(): this
    Ucomponent(): this
    GetClassName(): string
    GetInterfaceName(): string
    GetComponent(): IComponent
}

export class ECSInterface implements IECSInterface {
    comment: string
    name: string
    nameUpper: string
    className: string
    interfaceName: string
    methods: { name: string, ret: string, fields: {}[], new: boolean }[] = []
    inheritInterfaces: { name: string }[] = []
    hasComponent: boolean = false
    hasUcomponent: boolean = false
    component: IComponent

    constructor() {
        this.name = helpers.Name();
        this.nameUpper = helpers.ToUpper(this.name);
        this.className = toUpper(this.name);
        this.interfaceName = "I" + this.className;
    }

    //
    // Docs
    //
    Comment(value: string) {
        this.comment = value;
        return this;
    }

    // 
    // Inherits
    // 
    Implement(this: this, value: ECSInterface): this
    Implement(this: this, value: string): this
    Implement(this: this, value: any): this {
        if (typeof value == 'string') {
            var str = value as string;
            this.inheritInterfaces.push({ name: str })
        } else {
            var ecs = value as ECSInterface;
            this.inheritInterfaces.push({ name: ecs.interfaceName })

            for (var i = 0; i < ecs.methods.length; i++) {
                var method = {
                    name: ecs.methods[i].name,
                    fields: ecs.methods[i].fields,
                    ret: ecs.methods[i].ret,
                    new: false
                }
                var methodExists = false;

                for (var m = 0; m < this.methods.length; m++) {
                    if (this.methods[m].name == method.name &&
                        JSON.stringify(this.methods[m].fields) === JSON.stringify(method.fields)) {
                        methodExists = true;
                        break;
                    }
                }

                if (!methodExists) {
                    method.new = true;
                    this.methods.push(method);
                }
            }
        }

        return this;
    }

    //
    // Methods
    // 
    Method(name: string, ret: string, ...fields: {}[]) {
        var method = {
            name: name,
            ret: ret,
            fields: [],
            new: false
        };

        for (var i = 0; i < fields.length; i++) {
            method.fields.push(fields[i]);
        }

        var methodExists = false;

        for (var m = 0; m < this.methods.length; m++) {
            if (this.methods[m].name == method.name &&
                JSON.stringify(this.methods[m].fields) === JSON.stringify(method.fields)) {
                methodExists = true;
                break;
            }
        }

        if (!methodExists) {
            this.methods.push(method);
        }

        return this;
    }

    //
    // Component
    //
    Component() {
        this.hasComponent = true;
        this.hasUcomponent = false;
        this.component = component({
            value: this.interfaceName
        }, helpers.ToLower(this.className));
        return this;
    }

    Ucomponent() {
        this.hasUcomponent = true;
        this.hasComponent = false;
        this.component = ucomponent({
            value: this.interfaceName
        }, helpers.ToLower(this.className));
        return this;
    }

    // 
    // Getters
    // 
    GetClassName() {
        return this.className;
    }

    GetInterfaceName() {
        return this.interfaceName;
    }

    GetComponent() {
        return this.component;
    }
}



export function ecsInterface(): IECSInterface {
    var el = new ECSInterface();
    el.className = "I" + el.className;
    map.Add("interfaces", el);
    return el;
}