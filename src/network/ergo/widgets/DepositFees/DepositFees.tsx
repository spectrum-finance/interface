import { t } from '@lingui/macro';
import React, { FC } from 'react';

import {
  FeesView,
  FeesViewItem,
} from '../../../../components/FeesBox/FeesView';
import { useMinExFee } from '../../settings/executionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useMinTotalFee } from '../../settings/totalFees';

export const DepositFees: FC = () => {
  const minExFee = useMinExFee();
  const minTotalFee = useMinTotalFee();
  const minerFee = useMinerFee();

  const fees: FeesViewItem[] = [
    { caption: t`Miner Fee`, currency: minerFee },
    { caption: t`Execution Fee`, currency: minExFee },
  ];

  return <FeesView totalFees={minTotalFee} fees={fees} />;
};
