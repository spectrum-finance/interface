import { t } from '@lingui/macro';
import { FC } from 'react';

import { FeesView } from '../../../../components/FeesView/FeesView';
import { useMinerFee } from '../../settings/minerFee';

export const CreatePoolConfirmationInfo: FC = () => {
  const minerFee = useMinerFee();
  return (
    <FeesView feeItems={[{ caption: t`Network Fee`, fee: minerFee.mult(2) }]} />
  );
};
