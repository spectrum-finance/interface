import { t } from '@lingui/macro';
import { FC } from 'react';

import { FeesView } from '../../../../../components/FeesView/FeesView';
import { useMinExFee } from '../../../settings/executionFee/executionFee';
import { useMinerFee } from '../../../settings/minerFee';

export const DepositConfirmationInfo: FC = () => {
  const minExFee = useMinExFee();
  const minerFee = useMinerFee();

  return (
    <FeesView
      feeItems={[{ caption: t`Network Fee`, fee: minerFee }]}
      executionFee={minExFee}
    />
  );
};
