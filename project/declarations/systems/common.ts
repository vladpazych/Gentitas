import { Matcher, EventType, initializeSystem, executeSystem, reactiveSystem } from '../../lib/lib';
import alias from '../alias'
import contexts from '../contexts';
import components from '../components';

class all {
    // 
    // General
    //
    createApplicationEntity = initializeSystem(contexts.core)
        .Comment("Create Application entity")

    processActionEntity = reactiveSystem(contexts.meta)
        // Just to show that you can have many triggers
        .Trigger(Matcher.AllOf(components.action), EventType.onEntered)
        .Trigger(Matcher.AllOf(components.action).NoneOf(components.resolved), EventType.onEntered)
        .Ensure(components.action)
        .Exclude(components.resolved)
        // With BunchEntities you will need to implement 'void Act(List<MetaEntity> entities)'
        // Without - 'void Act(MetaEntity entity)'
        .BunchEntities()
        // With Filter you can implement 'bool ValueFilter(Entity entity)'
        .Filter()
        .PropEntity(contexts.core, components.application)
        // Just for example, useful to use when you need to match few non-unique components,
        // like Player and Left:
        .PropGroupSingle(contexts.core, Matcher.AllOf(components.application), 'anotherApplicationReference')
};

export default new all();