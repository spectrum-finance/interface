import { t } from '@lingui/macro';
import React, { FC } from 'react';

import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { useMinExFee } from '../../../settings/executionFee/executionFee';
import { useMinerFee } from '../../../settings/minerFee';

export const RedeemConfirmationInfo: FC = () => {
  const minExFee = useMinExFee();
  const minerFee = useMinerFee();

  const fees: FeesViewItem[] = [
    { caption: t`Miner Fee`, currency: minerFee },
    { caption: t`Execution Fee`, currency: minExFee },
  ];

  return <FeesView totalFees={[minerFee, minExFee]} fees={fees} />;
};
