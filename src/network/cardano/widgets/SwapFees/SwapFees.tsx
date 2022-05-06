import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import {
  FeesView,
  FeesViewItem,
} from '../../../../components/FeesBox/FeesView';
import { depositAda } from '../../settings/depositAda';
import { useMaxExFee, useMinExFee } from '../../settings/executionFee';
import { useMaxTotalFee, useMinTotalFee } from '../../settings/totalFee';
import { useTransactionFee } from '../../settings/transactionFee';

export const SwapFees: FC = () => {
  const minExFee = useMinExFee('swap');
  const maxExFee = useMaxExFee('swap');
  const minTotalFee = useMinTotalFee('swap');
  const maxTotalFee = useMaxTotalFee('swap');
  const transactionFee = useTransactionFee('swap');

  const totalFees: [Currency, Currency] = [minTotalFee, maxTotalFee];
  const fees: FeesViewItem[] = [
    { caption: t`Transaction Fee`, currency: transactionFee },
    { caption: t`Execution Fee`, currency: [minExFee, maxExFee] },
    { caption: t`Deposit ADA`, currency: depositAda },
  ];

  return <FeesView totalFees={totalFees} fees={fees} />;
};
