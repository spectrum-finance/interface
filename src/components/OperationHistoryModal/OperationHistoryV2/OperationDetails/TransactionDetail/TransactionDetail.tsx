import { Flex, Typography } from '@ergolabs/ui-kit';
import { DateTime } from 'luxon';
import React, { FC, ReactNode } from 'react';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { Currency } from '../../../../../common/models/Currency';
import { CopyButton } from '../../../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../../../common/ExploreButton/ExploreButton';
import { AssetPairDetail } from './AssetPairDetail/AssetPairDetail';
import { LpAssetDetails } from './LpAssetDetails/LpAssetDetails';
import { SingleAssetDetail } from './SingleAssetDetail/SingleAssetDetail';

const isPair = (
  data: [Currency, Currency] | [AssetInfo, AssetInfo, Currency],
): data is [Currency, Currency] => {
  return data[0] instanceof Currency;
};

export interface TransactionDetailProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly dateTime: DateTime;
  readonly data:
    | Currency
    | [Currency, Currency]
    | [AssetInfo, AssetInfo, Currency];
}

export const TransactionDetail: FC<TransactionDetailProps> = ({
  title,
  dateTime,
  data,
}) => {
  return (
    <Flex col width="100%" stretch>
      <Flex.Item
        marginBottom={2}
        width="100%"
        display="flex"
        align="center"
        justify="space-between"
      >
        <Flex.Item>
          <Typography.Body strong secondary>
            {title}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body strong>
            {dateTime.toFormat('dd MMM, yy')}{' '}
          </Typography.Body>
          <Typography.Body strong secondary>
            {dateTime.toFormat('HH:MM')}
          </Typography.Body>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item flex={1} display="flex" align="center" justify="space-between">
        <Flex.Item minWidth={188}>
          {data instanceof Array ? (
            <>
              {isPair(data) ? (
                <AssetPairDetail pair={data} />
              ) : (
                <LpAssetDetails currencies={data} />
              )}
            </>
          ) : (
            <SingleAssetDetail currency={data} />
          )}
        </Flex.Item>
        <Flex.Item display="flex">
          <Flex.Item marginRight={2}>
            <ExploreButton to="" size="middle" />
          </Flex.Item>
          <CopyButton text="" size="middle" />
        </Flex.Item>
      </Flex.Item>
    </Flex>
  );
};
