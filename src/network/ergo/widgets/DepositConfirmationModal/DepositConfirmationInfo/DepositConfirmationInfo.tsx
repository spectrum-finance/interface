import { t } from '@lingui/macro';
import { FC } from 'react';

import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { useMinExFee } from '../../../settings/executionFee/executionFee';
import { useMinerFee } from '../../../settings/minerFee';

export const DepositConfirmationInfo: FC = () => {
  const minExFee = useMinExFee();
  const minerFee = useMinerFee();

  const fees: FeesViewItem[] = [
    { caption: t`Execution Fee`, currency: minExFee },
    { caption: t`Miner Fee`, currency: minerFee },
  ];

  return <FeesView totalFees={[minerFee, minExFee]} fees={fees} />;
};
