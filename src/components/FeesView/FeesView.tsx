import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
// import { isArray } from 'lodash';
import { FC } from 'react';

import { Currency } from '../../common/models/Currency';
import RefundableDepositTooltipContent from '../../network/cardano/components/RefundableDepositTooltipContent/RefundableDepositTooltipContent.tsx';
// import { useSelectedNetwork } from '../../gateway/common/network';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { BoxInfoItem } from '../BoxInfoItem/BoxInfoItem';
import { ConvenientAssetView } from '../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { Truncate } from '../Truncate/Truncate.tsx';

export interface FeesViewItem {
  caption: string;
  currency: Currency;
}

export interface FeesViewProps {
  readonly fees: FeesViewItem[];
  readonly executionFee: [Currency, Currency];
  readonly refundableDeposit?: Currency;
}

export const FeesView: FC<FeesViewProps> = ({
  fees,
  executionFee,
  refundableDeposit,
}) => {
  // const [selectedNetwork] = useSelectedNetwork();
  const feeSum: Currency = fees.reduce((acc, fee) => {
    return acc.plus(fee.currency);
  }, new Currency(0n, fees[0].currency.asset));

  return (
    <>
      {refundableDeposit && (
        <Flex.Item marginBottom={2}>
          <BoxInfoItem
            title={
              <>
                <InfoTooltip
                  content={<RefundableDepositTooltipContent />}
                  width={300}
                >
                  <Typography.Body size="large">
                    <Trans>Refundable deposit</Trans>
                  </Typography.Body>
                </InfoTooltip>
                <Typography.Body size="large">:</Typography.Body>
              </>
            }
            value={
              <Typography.Body size="large" strong>
                <>
                  {refundableDeposit.toString()}{' '}
                  <Truncate>{refundableDeposit.asset.name}</Truncate>
                </>
              </Typography.Body>
            }
          />
        </Flex.Item>
      )}

      <BoxInfoItem
        title={
          <>
            <InfoTooltip
              placement="right"
              content={
                <Flex col>
                  <Flex.Item display="flex" align="center" marginBottom={1}>
                    <Flex.Item marginRight={1}>Execution Fee:</Flex.Item>
                    <Flex.Item align="center" display="flex">
                      <Flex.Item marginRight={1}>
                        <AssetIcon
                          size="extraSmall"
                          asset={executionFee[0].asset}
                        />
                      </Flex.Item>
                      {`${executionFee[0].toString()} - ${executionFee[1].toString()} ${
                        executionFee[0].asset.ticker
                      }`}
                    </Flex.Item>
                  </Flex.Item>
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
                            asset={f.currency.asset}
                          />
                        </Flex.Item>
                        {`${f.currency.toString()} `}{' '}
                        <Truncate>{f.currency.asset.ticker}</Truncate>
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
            <ConvenientAssetView value={[executionFee[0], feeSum]} /> -{' '}
            <ConvenientAssetView value={[executionFee[1], feeSum]} />
          </Typography.Body>
        }
      />
    </>
  );
};
