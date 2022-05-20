import { Explorer } from '@ergolabs/ergo-sdk';

import { applicationConfig } from '../applicationConfig';

const explorer = new Explorer(
  applicationConfig.networksSettings.ergo.networkUrl,
);

export { explorer };
