import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import {
  FeesView,
  FeesViewItem,
} from '../../../../components/FeesBox/FeesView';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { useMinerFee } from '../../settings/minerFee';
import { useMaxTotalFee, useMinTotalFee } from '../../settings/totalFees';

export const SwapFees: FC = () => {
  const minExFee = useMinExFee();
  const maxExFee = useMaxExFee();
  const minTotalFee = useMinTotalFee();
  const maxTotalFee = useMaxTotalFee();
  const minerFee = useMinerFee();

  const totalFees: [Currency, Currency] = [minTotalFee, maxTotalFee];
  const fees: FeesViewItem[] = [
    { caption: t`Miner Fee`, currency: minerFee },
    { caption: t`Execution Fee`, currency: [minExFee, maxExFee] },
  ];

  return <FeesView totalFees={totalFees} fees={fees} />;
};
