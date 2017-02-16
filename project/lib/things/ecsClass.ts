import { IECSInterface, ECSInterface } from './ecsInterface';
import { IContext } from './context';
import { IUcomponent } from './component';
import Matcher from './matcher'
import * as helpers from './helpers';
import map from '../../map';

export interface IECSClass extends IECSInterface {
    PropEntity(context: IContext, ucomponent: IUcomponent): this
    PropGroup(context: IContext, matcher: Matcher, name: string): this
    PropGroupSingle(context: IContext, matcher: Matcher, name: string): this
    PropContext(context: IContext): this
    Inherit(value: string): this
}

export class ECSClass extends ECSInterface implements IECSClass {
    propsEntity: { context: IContext, ucomponent: IUcomponent }[] = []
    propsGroup: { context: IContext, matcher: Matcher, name: string }[] = []
    propsGroupSingle: { context: IContext, matcher: Matcher, name: string }[] = []
    propsContext: IContext[] = []
    inheritClass: string

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

    // 
    // Inherits
    // 
    Inherit(value: string) {
        this.inheritClass = value;
        return this;
    }
}



export function ecsClass(): IECSClass {
    var el = new ECSClass();
    map.Add("classes", el);
    return el;
}