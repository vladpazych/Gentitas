import { component, ucomponent } from '../lib/lib';
import alias from './alias'
import contexts from './contexts';

class all {
    // Components without specified context will be added to context.core (see ../modifier.ts).
    application = ucomponent()
    loaded = component()

    // To make component available in more than one context:
    name = component({
        value: alias.string
    }).Contexts(contexts.core, contexts.meta) // Will be in both core and meta contexts
    
    action = component({
        value: alias.string
    }).Contexts(contexts.meta) // Will be in meta context only
    resolved = component().Contexts(contexts.meta) // Will be in meta context only
};

export default new all();