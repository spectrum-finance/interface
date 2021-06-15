import { useState } from 'react';
import { Explorer, NetworkPools } from 'ergo-dex-sdk';

export const usePools = () => {
  const networkPool = useState(
    new NetworkPools(new Explorer('https://api.ergoplatform.com/api/v1')),
  );
};
