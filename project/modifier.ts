import map from './map';
import contexts from './declarations/contexts';

for (var key in map['components']) {
    var comp = map['components'][key];
    if (!comp.contexts.length) {
        comp.Contexts(contexts.core);
    }
}