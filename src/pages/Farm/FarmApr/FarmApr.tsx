import { blocksToDaysCount } from '@ergolabs/ergo-dex-sdk';
import numeral from 'numeral';
import React, { useMemo } from 'react';

import { convertToConvenientNetworkAsset } from '../../../api/convertToConvenientNetworkAsset';
import { useObservable } from '../../../common/hooks/useObservable';
import { LmPool, LmStatuses } from '../../../common/models/LmPool';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import { DataTag } from '../../../components/common/DataTag/DataTag';
import { networkContext$ } from '../../../gateway/api/networkContext';

export const APRComponent = ({ lmPool }: { lmPool: LmPool }) => {
  // interests_relation = program_budget_left_in_usd / amount_lq_locked_in_usd

  // apr = interests_relation / lm_program_left_in_days * 365 * 100

  const [networkContext] = useObservable(networkContext$);
  const amountLqLockedInUsd$ = useMemo(
    () => convertToConvenientNetworkAsset(lmPool.shares),
    [lmPool.shares],
  );
  const programBudgetLeftInUsd$ = useMemo(
    () => convertToConvenientNetworkAsset(lmPool.reward),
    [lmPool.shares],
  );

  const [amountLqLockedInUsd] = useObservable(amountLqLockedInUsd$, [
    lmPool.shares,
  ]);
  const [programBudgetLeftInUsd] = useObservable(programBudgetLeftInUsd$, [
    lmPool.reward,
  ]);

  if (
    amountLqLockedInUsd &&
    programBudgetLeftInUsd &&
    networkContext?.height &&
    lmPool.currentStatus === LmStatuses.LIVE
  ) {
    const interestsRelation = numeral(programBudgetLeftInUsd.toAmount()).divide(
      amountLqLockedInUsd.toAmount(),
    );
    const { programStart, epochLen, epochNum } = lmPool.config;
    const lmProgramLeftInBlocks =
      programStart + epochLen * epochNum - networkContext.height;
    const lmProgramLeftInDays = blocksToDaysCount(lmProgramLeftInBlocks);

    const apr = interestsRelation
      .divide(lmProgramLeftInDays)
      .multiply(365)
      .multiply(100)
      .value();

    <DataTag
      size="large"
      content={
        <>
          <AssetIcon asset={lmPool.reward.asset} />
          {apr}%
        </>
      }
    />;
  }

  return null;
};
