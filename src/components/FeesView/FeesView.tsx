import { Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { Currency } from '../../common/models/Currency';
import { useSelectedNetwork } from '../../gateway/common/network.ts';
import { FeesSkeletonLoading } from '../../network/cardano/components/FeesSkeletonLoading/FeesSkeletonLoading.tsx';
import RefundableDepositTooltipContent from '../../network/cardano/components/RefundableDepositTooltipContent/RefundableDepositTooltipContent.tsx';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { BoxInfoItem } from '../BoxInfoItem/BoxInfoItem';
import { ConvenientAssetView } from '../ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { Truncate } from '../Truncate/Truncate.tsx';

export type ExecutionFee =
  | Currency
  | [Currency | undefined, Currency | undefined];
export interface FeesViewItem {
  caption: string;
  fee?: Currency;
}

export interface FeesViewProps {
  readonly feeItems: FeesViewItem[];
  readonly executionFee?: ExecutionFee;
  readonly refundableDeposit?: Currency;
}

interface TotalFeeValueProps {
  readonly feeSum: Currency;
  readonly executionFee?: ExecutionFee;
}

interface ExecutionFeeTooltipValueProps {
  readonly executionFee?: ExecutionFee;
}

const clacFeeSum = (fees: FeesViewItem[]): Currency => {
  if (fees.length > 0 && !!fees[0].fee) {
    return fees.reduce((acc, fee) => {
      return acc.plus(fee.fee!);
      return acc;
    }, new Currency(0n, fees[0].fee.asset));
  }
  return new Currency(0n);
};

const TotalFeeValue: FC<TotalFeeValueProps> = ({ feeSum, executionFee }) => {
  if (!executionFee || !feeSum) {
    return <FeesSkeletonLoading />;
  }

  if (executionFee instanceof Array) {
    return (
      <>
        {executionFee[0] && executionFee[1] && (
          <Typography.Body size="large" strong>
            <ConvenientAssetView value={[executionFee[0], feeSum]} /> -{' '}
            <ConvenientAssetView value={[executionFee[1], feeSum]} />
          </Typography.Body>
        )}
      </>
    );
  }

  return (
    <Typography.Body size="large" strong>
      <ConvenientAssetView value={[executionFee, feeSum]} />
    </Typography.Body>
  );
};

const ExecutionFeeTooltipValue: FC<ExecutionFeeTooltipValueProps> = ({
  executionFee,
}) => {
  console.log('executionFee', executionFee);
  if (
    !executionFee ||
    (executionFee instanceof Array && !executionFee[0]) ||
    !executionFee[1]
  ) {
    return <FeesSkeletonLoading />;
  }

  return (
    <Flex.Item display="flex" align="center" marginBottom={1}>
      <Flex.Item marginRight={1}>Execution Fee:</Flex.Item>
      <Flex.Item align="center" display="flex">
        {executionFee instanceof Array ? (
          <>
            <Flex.Item marginRight={1}>
              <AssetIcon size="extraSmall" asset={executionFee[0].asset} />
            </Flex.Item>
            {`${executionFee[0].toString()} - ${executionFee[1].toString()} ${
              executionFee[0].asset.ticker
            }`}
          </>
        ) : (
          <>
            <Flex.Item marginRight={1}>
              <AssetIcon size="extraSmall" asset={executionFee.asset} />
            </Flex.Item>
            {`${executionFee.toString()} ${executionFee.asset.ticker}`}
          </>
        )}
      </Flex.Item>
    </Flex.Item>
  );
};

export const FeesView: FC<FeesViewProps> = ({
  feeItems,
  executionFee,
  refundableDeposit,
}) => {
  const [network] = useSelectedNetwork();
  const feeSum = clacFeeSum(feeItems);

  return (
    <>
      {network.name === 'cardano' && (
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
              <>
                {refundableDeposit ? (
                  <Typography.Body size="large" strong>
                    <>
                      {refundableDeposit.toString()}{' '}
                      <Truncate>{refundableDeposit.asset.name}</Truncate>
                    </>
                  </Typography.Body>
                ) : (
                  <FeesSkeletonLoading />
                )}
              </>
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
                  <ExecutionFeeTooltipValue />
                  {feeItems.map((item, index) => (
                    <Flex.Item
                      display="flex"
                      align="center"
                      key={index}
                      marginBottom={index === feeItems.length - 1 ? 0 : 1}
                    >
                      <Flex.Item marginRight={1}>{item.caption}:</Flex.Item>
                      <Flex.Item align="center" display="flex">
                        {item.fee ? (
                          <>
                            <Flex.Item marginRight={1}>
                              <AssetIcon
                                size="extraSmall"
                                asset={item.fee.asset}
                              />
                            </Flex.Item>
                            {`${item.fee.toString()} `}{' '}
                            <Truncate>{item.fee.asset.ticker}</Truncate>
                          </>
                        ) : (
                          <FeesSkeletonLoading />
                        )}
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
        value={<TotalFeeValue feeSum={feeSum} executionFee={executionFee} />}
      />
    </>
  );
};
