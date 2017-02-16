import { Matcher, ecsInterface } from '../../lib/lib';
import alias from '../alias'
import contexts from '../contexts';
import components from '../components';

class all {
    someDoable = ecsInterface()
        .Method("DoSome", alias.void)
        .Method("DoAnotherSome", alias.vector2, { value: alias.dict(alias.string, alias.vector2) })
        // Component will create component that holds ISomeDoable as value field:
        // You can alow specify Ucomponent() instead of Component().
        .Component()
};

export default new all();