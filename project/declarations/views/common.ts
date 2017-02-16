import { Matcher, view } from '../../lib/lib';
import alias from '../alias'
import contexts from '../contexts';
import components from '../components';
import classesCommon from '../ecsClasses/common'

class all {
    someElement = view()
        // Will create reference for ucomponent of that service as cached property
        .PropEntity(contexts.core, classesCommon.someOtherService.GetComponent())
        .PropGO('Body', 'body')
        .PropMB(alias.mb.animator)
        .PropMBExternal(alias.mb.animator, "Body/Common", "commonAnimator")
        .PropContext(contexts.meta)
        .Method("Rotate", alias.void, { direction: alias.int })
        // MethodEditor will create buttons in custom inspector for BaseSomeElementView
        .MethodEditor("RotateLeft")
        .MethodEditor("RotateRight")
        .Component()
}

export default new all();