import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { FeesView } from '../../../../../components/FeesView/FeesView';
import { depositAda } from '../../../settings/depositAda';
import { useMinExFee } from '../../../settings/executionFee';
import { useTransactionFee } from '../../../settings/transactionFee';

export const DepositConfirmationInfo: FC = () => {
  const minExFee = useMinExFee('swap');
  const networkFee = useTransactionFee('swap');

  return (
    <Flex col>
      <FeesView
        feeItems={[{ caption: t`Network Fee`, fee: networkFee }]}
        executionFee={minExFee}
        refundableDeposit={depositAda}
      />
    </Flex>
  );
};
