import { t } from '@lingui/macro';
import React, { FC } from 'react';

import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { useMinerFee } from '../../../settings/minerFee';

export const RefundConfirmationInfo: FC = () => {
  const minerFee = useMinerFee();

  const fees: FeesViewItem[] = [{ caption: t`Miner Fee`, currency: minerFee }];

  return <FeesView totalFees={minerFee} fees={fees} />;
};
