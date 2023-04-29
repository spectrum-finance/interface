import { Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { depositAda } from '../../../settings/depositAda';
import { useMinExFee } from '../../../settings/executionFee';
import { useTransactionFee } from '../../../settings/transactionFee';

export const DepositConfirmationInfo: FC = () => {
  const minExFee = useMinExFee('swap');
  const transactionFee = useTransactionFee('swap');

  const fees: FeesViewItem[] = [
    { caption: t`Execution Fee`, currency: minExFee },
    { caption: t`Transaction Fee`, currency: transactionFee },
  ];

  return (
    <Flex col>
      <Flex.Item marginBottom={2}>
        <BoxInfoItem
          title={
            <Typography.Body size="large">
              <Trans>Refundable deposit:</Trans>
            </Typography.Body>
          }
          value={
            <Typography.Body size="large" strong>
              {depositAda.toString()}{' '}
              <Truncate>{depositAda.asset.name}</Truncate>
            </Typography.Body>
          }
        />
      </Flex.Item>
      <FeesView totalFees={[minExFee, transactionFee]} fees={fees} />
    </Flex>
  );
};
