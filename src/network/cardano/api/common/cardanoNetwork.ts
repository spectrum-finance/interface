import { Quickblue } from '@ergolabs/cardano-dex-sdk';
import { NetworkParams } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { from, Observable, publishReplay, refCount } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';

export const cardanoNetwork = new Quickblue(
  applicationConfig.networksSettings.cardano.url,
);

export const cardanoNetworkParams$: Observable<NetworkParams> = from(
  cardanoNetwork.getNetworkParams(),
).pipe(publishReplay(1), refCount());
