import { IECSInterface } from './ecsInterface';
import { ECSClass, IECSClass } from './ecsClass';
import * as helpers from './helpers';
import map from '../../map';

export interface IView extends IECSClass {
    PropMB(type: string): this
    PropMBExternal(type: string, finder: string, name: string): this
    PropGO(finder: string, name: string): this
    MethodEditor(name: string, ...fields: {}[]): this
}

export class View extends ECSClass implements IView {
    propsMB: { type: string, name: string }[] = []
    propsMBExternal: { type: string, finder: string, name: string }[] = []
    propsGO: { finder: string, name: string }[] = []
    methodsEditor: { name: string, fields: {}[] }[] = []

    constructor() {
        super();
        this.className += "View";
        this.interfaceName += "View";
    }

    // 
    // Props
    //
    PropMB(type: string) {
        var splitted = type.split('.');
        var name = splitted[splitted.length - 1];
        this.propsMB.push({ type: type, name: name });
        return this;
    }

    PropMBExternal(type: string, finder: string, name: string) {
        this.propsMBExternal.push({ finder: finder, type: type, name: name });
        return this;
    }

    PropGO(finder: string, name: string) {
        this.propsGO.push({ finder: finder, name: name });
        return this;
    }

    // 
    // Methods
    // 
    MethodEditor(name: string, ...fields: {}[]) {
        var method = {
            name: name + "Test",
            fields: []
        };

        for (var i = 0; i < fields.length; i++) {
            method.fields.push(fields[i]);
        }

        this.methodsEditor.push(method);
        return this;
    }
}



export function view(): IView {
    var el = new View();
    map.Add('views', el);
    return el;
}