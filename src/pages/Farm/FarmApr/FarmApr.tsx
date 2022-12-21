import { blocksToDaysCount } from '@ergolabs/ergo-dex-sdk';
import { Typography } from '@ergolabs/ui-kit';
import numeral from 'numeral';
import React, { useMemo } from 'react';

import { convertToConvenientNetworkAsset } from '../../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../../common/hooks/useObservable';
import { LmPool } from '../../../common/models/LmPool';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { networkContext$ } from '../../../gateway/api/networkContext';
import { FarmState } from '../types/FarmState';

export const APRComponent = ({ lmPool }: { lmPool: LmPool }) => {
  const [networkContext] = useObservable(networkContext$);
  const amountLqLockedInUsd$ = useMemo(
    () => convertToConvenientNetworkAsset(lmPool.shares),
    [lmPool.shares],
  );
  const programBudgetLeftInUsd$ = useMemo(
    () => convertToConvenientNetworkAsset(lmPool.reward),
    [lmPool.reward],
  );

  const [amountLqLockedInUsd] = useObservable(amountLqLockedInUsd$, [
    amountLqLockedInUsd$,
  ]);
  const [programBudgetLeftInUsd] = useObservable(programBudgetLeftInUsd$, [
    lmPool.reward,
  ]);

  if (
    amountLqLockedInUsd &&
    programBudgetLeftInUsd &&
    networkContext?.height &&
    lmPool.currentStatus === FarmState.Live
  ) {
    const apr = lmPool.getApr(programBudgetLeftInUsd, amountLqLockedInUsd);

    return (
      <DataTag
        size="large"
        content={
          <Typography.Body>
            <AssetIcon asset={lmPool.reward.asset} />
            {apr}%
          </Typography.Body>
        }
      />
    );
  }

  return <Typography.Body>$---</Typography.Body>;
};
