import { IComponent} from './component';

class Matcher {
    allOf: IComponent[] = []
    anyOf: IComponent[] = []
    noneOf: IComponent[] = []

    static AllOf(...components: IComponent[]) {
        var that = new Matcher();

        for (var component of components) {
            that.allOf.push(component);
        }

        return that;
    }

    static AnyOf(...components: IComponent[]) {
        var that = new Matcher();

        for (var component of components) {
            that.anyOf.push(component);
        }
        
        return that;
    }

    static NoneOf(...components: IComponent[]) {
        var that = new Matcher();

        for (var component of components) {
            that.noneOf.push(component);
        }

        return that;
    }

    AllOf(...components: IComponent[]) {
        for (var component of components) {
            this.allOf.push(component);
        }

        return this;
    }

    AnyOf(...components: IComponent[]) {
        for (var component of components) {
            this.anyOf.push(component);
        }

        return this;
    }

    NoneOf(...components: IComponent[]) {
        for (var component of components) {
            this.noneOf.push(component);
        }

        return this;
    }
}


export default Matcher;