import { chainSystem } from '../lib/lib';

import common from './systems/common';

class all {
    init_application = chainSystem(
        common.createApplicationEntity
    )

    some_group = chainSystem(
        common.processActionEntity
    )
};

export default new all();