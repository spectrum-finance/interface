import { Quickblue } from '@ergolabs/cardano-dex-sdk';

import { applicationConfig } from '../../../../applicationConfig';

export const cardanoNetwork = new Quickblue(
  applicationConfig.networksSettings.cardano.url,
);
