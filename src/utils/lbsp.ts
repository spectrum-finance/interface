import { DateTime } from 'luxon';

import { applicationConfig } from '../applicationConfig.ts';

export const isPreLbspTimeGap = () => {
  return applicationConfig.cardanoAmmSwapsOpenTime > DateTime.now();
};

export const isLbspAmmPool = (poolId: string) => {
  return applicationConfig.lbspLiquidityPools.some((el) => el === poolId);
};
