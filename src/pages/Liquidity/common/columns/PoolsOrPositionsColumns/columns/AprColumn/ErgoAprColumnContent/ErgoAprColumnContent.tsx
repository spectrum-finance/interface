import { FC } from 'react';

import { AmmPool } from '../../../../../../../../common/models/AmmPool';

export interface ErgoAprColumnContentProps {
  readonly ammPool: AmmPool;
}

export const ErgoAprColumnContent: FC<ErgoAprColumnContentProps> = ({
  ammPool,
}) => <>{ammPool.yearlyFeesPercent ? `${ammPool.yearlyFeesPercent}%` : '—'}</>;
