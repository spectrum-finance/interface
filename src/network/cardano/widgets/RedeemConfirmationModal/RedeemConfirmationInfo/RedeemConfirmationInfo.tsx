import { Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { BoxInfoItem } from '../../../../../components/BoxInfoItem/BoxInfoItem';
import {
  FeesView,
  FeesViewItem,
} from '../../../../../components/FeesView/FeesView';
import { Truncate } from '../../../../../components/Truncate/Truncate';
import { depositAda } from '../../../settings/depositAda';
import { useMinExFee } from '../../../settings/executionFee';
import { useMinTotalFee } from '../../../settings/totalFee';
import { useTransactionFee } from '../../../settings/transactionFee';

export const RedeemConfirmationInfo: FC = () => {
  const minExFee = useMinExFee('swap');
  const minTotalFee = useMinTotalFee('swap');
  const transactionFee = useTransactionFee('swap');

  const fees: FeesViewItem[] = [
    { caption: t`Transaction Fee`, currency: transactionFee },
    { caption: t`Execution Fee`, currency: minExFee },
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
      <FeesView totalFees={minTotalFee} fees={fees} />
    </Flex>
  );
};
