import { Typography } from '@ergolabs/ui-kit';
import React from 'react';

import { Farm } from '../../../common/models/Farm';

export const APRComponent = ({ lmPool }: { lmPool: Farm }) => {
  // const [networkContext] = useObservable(networkContext$);
  // const amountLqLockedInUsd$ = useMemo(
  //   () => convertToConvenientNetworkAsset(lmPool.shares),
  //   [lmPool.shares],
  // );
  // const programBudgetLeftInUsd$ = useMemo(
  //   () => convertToConvenientNetworkAsset(lmPool.reward),
  //   [lmPool.reward],
  // );
  //
  // const [amountLqLockedInUsd] = useObservable(amountLqLockedInUsd$, [
  //   amountLqLockedInUsd$,
  // ]);
  // const [programBudgetLeftInUsd] = useObservable(programBudgetLeftInUsd$, [
  //   lmPool.reward,
  // ]);
  //
  // if (
  //   amountLqLockedInUsd &&
  //   programBudgetLeftInUsd &&
  //   networkContext?.height &&
  //   lmPool.currentStatus === FarmState.Live
  // ) {
  //   const apr = lmPool.getApr(programBudgetLeftInUsd, amountLqLockedInUsd);
  //
  //   return (
  //     <DataTag
  //       size="large"
  //       content={
  //         <Typography.Body>
  //           <AssetIcon asset={lmPool.reward.asset} />
  //           {apr}%
  //         </Typography.Body>
  //       }
  //     />
  //   );
  // }

  return <Typography.Body>$---</Typography.Body>;
};
