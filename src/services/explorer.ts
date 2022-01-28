import { Explorer } from '@ergolabs/ergo-sdk';

import { ERGO_BASE_URL } from '../common/constants/env';

const explorer = new Explorer(ERGO_BASE_URL);

export { explorer };
