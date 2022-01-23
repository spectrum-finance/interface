import { mkLockParser, mkLocksHistory } from '@ergolabs/ergo-dex-sdk';

import { explorer } from '../../../services/explorer';

export const locksHistory = mkLocksHistory(explorer, mkLockParser());
