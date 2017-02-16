class Globals {
    Add(key: string, namable: { name: string }) {
        if (!this[key]) this[key] = {};
        this[key][namable.name] = namable;
    }

    Remove(key: string) {
        if (this[key] != undefined) delete this[key];
    }
}

export default new Globals();