import { Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';

import { Currency } from '../../common/models/Currency';
import { Flex, Typography } from '../../ergodex-cdk';
import { BoxInfoItem } from '../BoxInfoItem/BoxInfoItem';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

export interface FeesViewItem {
  caption: ReactNode | ReactNode[] | string;
  currency: Currency | [Currency, Currency];
}

export interface FeesViewProps {
  readonly fees: FeesViewItem[];
  readonly totalFees: Currency | [Currency, Currency];
}

export const FeesView: FC<FeesViewProps> = ({ fees, totalFees }) => (
  <BoxInfoItem
    title={
      <Typography.Text>
        <Trans>Total Fees</Trans>
        <InfoTooltip
          placement="right"
          content={
            <Flex col>
              {fees.map((f, i) => (
                <Flex.Item display="flex" align="center" key={i}>
                  <Flex.Item marginRight={1}>{f.caption}:</Flex.Item>
                  <Flex.Item>
                    {f.currency instanceof Array
                      ? `${f.currency[0].toString()} - ${f.currency[1].toString()} ${
                          f.currency[0].asset.name
                        }`
                      : f.currency.toCurrencyString()}
                  </Flex.Item>
                </Flex.Item>
              ))}
            </Flex>
          }
        />
        :
      </Typography.Text>
    }
    value={
      <Typography.Text>
        {totalFees instanceof Array
          ? `${totalFees[0].toString()} - ${totalFees[1].toString()} ${
              totalFees[0].asset.name
            }`
          : totalFees.toCurrencyString()}
      </Typography.Text>
    }
  />
);
