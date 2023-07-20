import { DateTime } from 'luxon';

import { applicationConfig } from '../applicationConfig.ts';

export const isPreLbspTimeGap = () => {
  return applicationConfig.cardanoAmmSwapsOpenTime > DateTime.now();
};
