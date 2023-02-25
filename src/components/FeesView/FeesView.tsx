import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';

import { Currency } from '../../common/models/Currency';
import { useSelectedNetwork } from '../../gateway/common/network';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { BoxInfoItem } from '../BoxInfoItem/BoxInfoItem';
import { ConvenientAssetView } from '../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { IsErgo } from '../IsErgo/IsErgo';

export interface FeesViewItem {
  caption: ReactNode | ReactNode[] | string;
  currency: Currency | [Currency, Currency];
}

export interface TotalFees {
  minFeesForTotal: Currency[];
  maxFeesForTotal: Currency[];
}

export interface FeesViewProps {
  readonly fees: FeesViewItem[];
  readonly totalFees: Currency[] | TotalFees;
}

export const FeesView: FC<FeesViewProps> = ({ fees, totalFees }) => {
  const [selectedNetwork] = useSelectedNetwork();
  const sumTotalFees = (fees: Currency[]): Currency => {
    return fees.reduce(
      (sum, f) => sum.plus(f),
      new Currency(0n, fees[0].asset),
    );
  };

  return (
    <BoxInfoItem
      title={
        <>
          <InfoTooltip
            placement="right"
            content={
              <Flex col>
                {fees.map((f, i) => (
                  <Flex.Item
                    display="flex"
                    align="center"
                    key={i}
                    marginBottom={i === fees.length - 1 ? 0 : 1}
                  >
                    <Flex.Item marginRight={1}>{f.caption}:</Flex.Item>
                    <Flex.Item align="center" display="flex">
                      <Flex.Item marginRight={1}>
                        <AssetIcon
                          size="extraSmall"
                          asset={
                            f.currency instanceof Array
                              ? f.currency[0].asset
                              : f.currency.asset
                          }
                        />
                      </Flex.Item>
                      {f.currency instanceof Array
                        ? `${f.currency[0].toString()} - ${f.currency[1].toString()} ${
                            f.currency[0].asset.ticker
                          }`
                        : f.currency.toCurrencyString()}{' '}
                      <IsErgo>
                        (
                        {f.currency instanceof Array ? (
                          <>
                            <ConvenientAssetView value={f.currency[0]} /> -{' '}
                            <ConvenientAssetView
                              hidePrefix
                              value={f.currency[1]}
                            />
                          </>
                        ) : (
                          <ConvenientAssetView value={f.currency} />
                        )}
                        )
                      </IsErgo>
                    </Flex.Item>
                  </Flex.Item>
                ))}
              </Flex>
            }
          >
            <Typography.Body size="large">
              <Trans>Total Fees</Trans>
            </Typography.Body>
          </InfoTooltip>
          <Typography.Body size="large">:</Typography.Body>
        </>
      }
      value={
        <Typography.Body size="large" strong>
          {selectedNetwork.name === 'cardano' && (
            <>
              {totalFees instanceof Array
                ? sumTotalFees(totalFees).toCurrencyString()
                : `${sumTotalFees(
                    totalFees.minFeesForTotal,
                  ).toString()} - ${sumTotalFees(
                    totalFees.maxFeesForTotal,
                  ).toString()} ${totalFees.minFeesForTotal[0].asset.ticker}`}
            </>
          )}
          {selectedNetwork.name === 'ergo' && (
            <>
              {totalFees instanceof Array ? (
                <ConvenientAssetView value={totalFees} />
              ) : (
                <>
                  <ConvenientAssetView value={totalFees.minFeesForTotal} /> -{' '}
                  <ConvenientAssetView
                    hidePrefix
                    value={totalFees.maxFeesForTotal}
                  />
                </>
              )}
            </>
          )}
        </Typography.Body>
      }
    />
  );
};
