import { Box, Divider } from '@ergolabs/ui-kit';
import { Flex } from '@ergolabs/ui-kit/dist/components/Flex/Flex';
import { t } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { networkAsset } from '../../../../network/ergo/api/networkAsset/networkAsset';
import { TransactionDetail } from './TransactionDetail/TransactionDetail';
import { TransactionRefund } from './TransactionRefund/TransactionRefund';

export const OperationDetails: FC = () => (
  <Box bordered={false} height="100%" padding={4} accent glass>
    <Flex stretch width="100%">
      <Flex.Item flex={1}>
        <TransactionDetail
          title={t`Sent`}
          dateTime={DateTime.now()}
          data={[
            new Currency(20000000n, networkAsset),
            new Currency(20000000n, networkAsset),
          ]}
        />
      </Flex.Item>
      <Flex.Item marginRight={4} marginLeft={4}>
        <Divider type="vertical" />
      </Flex.Item>
      <Flex.Item flex={1}>
        {/*<TransactionDetail*/}
        {/*  title={t`Recieved`}*/}
        {/*  dateTime={DateTime.now()}*/}
        {/*  data={[*/}
        {/*    networkAsset,*/}
        {/*    networkAsset,*/}
        {/*    new Currency(20000000n, networkAsset),*/}
        {/*  ]}*/}
        {/*/>*/}
        <TransactionRefund title={t`Recieved`} />
      </Flex.Item>
    </Flex>
  </Box>
);
