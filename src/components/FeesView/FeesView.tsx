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
  | [Currency | undefined, Currency | undefined]
  | undefined;
export interface FeesViewItem {
  caption: string;
  fee?: Currency;
}

export interface FeesViewProps {
  readonly feeItems: FeesViewItem[];
  readonly executionFee?: ExecutionFee;
  readonly refundableDeposit?: Currency;
  readonly isLoading?: boolean;
}

interface TotalFeeValueProps {
  readonly feeItems: FeesViewItem[];
  readonly executionFee?: ExecutionFee;
  readonly isLoading?: boolean;
}

interface ExecutionFeeTooltipValueProps {
  readonly executionFee?: ExecutionFee;
  readonly isLoading?: boolean;
}

const TotalFeeValue: FC<TotalFeeValueProps> = ({
  feeItems,
  executionFee,
  isLoading = false,
}) => {
  if (isLoading) {
    return <FeesSkeletonLoading />;
  }
  const feeItemsCurrencies = feeItems.map((item) =>
    item.fee ? item.fee : new Currency(0n),
  );
  if (executionFee instanceof Array) {
    const executionFeePlusUIFeeMin = new Currency(
      (executionFee?.[0]?.amount || 0n) + 1_000_000n,
      executionFee[0]?.asset,
    );
    const executionFeePlusUIFeeMax = new Currency(
      (executionFee?.[1]?.amount || 0n) + 1_000_000n,
      executionFee[1]?.asset,
    );

    return (
      <>
        {executionFee?.[0] && executionFee?.[1] && feeItems && (
          <Typography.Body size="large" strong>
            <ConvenientAssetView
              value={[executionFeePlusUIFeeMin, ...feeItemsCurrencies]}
            />{' '}
            -{' '}
            <ConvenientAssetView
              value={[executionFeePlusUIFeeMax, ...feeItemsCurrencies]}
            />
          </Typography.Body>
        )}
      </>
    );
  }

  if (executionFee) {
    const executionFeePlusUIFee = new Currency(
      (executionFee?.amount || 0n) + 1_000_000n,
      executionFee?.asset,
    );
    return (
      <Typography.Body size="large" strong>
        <ConvenientAssetView
          value={[executionFeePlusUIFee, ...feeItemsCurrencies]}
        />
      </Typography.Body>
    );
  }

  return (
    <Typography.Body size="large" strong>
      <ConvenientAssetView value={feeItemsCurrencies} />
    </Typography.Body>
  );
};

const ExecutionFeeTooltipTextWrapper = ({ children }) => {
  return (
    <Flex.Item display="flex" align="center" marginBottom={1}>
      <Flex.Item marginRight={1}>Honey 🍯:</Flex.Item>
      <Flex.Item align="center" display="flex">
        {children}
      </Flex.Item>
    </Flex.Item>
  );
};

const ExecutionFeeTooltipValue: FC<ExecutionFeeTooltipValueProps> = ({
  executionFee,
  isLoading = false,
}) => {
  if (isLoading) {
    return <FeesSkeletonLoading />;
  }

  if (executionFee && 'asset' in executionFee) {
    return (
      <ExecutionFeeTooltipTextWrapper>
        <Flex.Item marginRight={1}>
          <AssetIcon size="extraSmall" asset={executionFee.asset} />
        </Flex.Item>
        {`${executionFee.toString()} ${executionFee.asset.ticker}`}
      </ExecutionFeeTooltipTextWrapper>
    );
  }

  if (executionFee instanceof Array && executionFee[0] && executionFee[1]) {
    return (
      <ExecutionFeeTooltipTextWrapper>
        <Flex.Item marginRight={1}>
          <AssetIcon size="extraSmall" asset={executionFee[0].asset} />
        </Flex.Item>
        {`${executionFee[0].toString()} - ${executionFee[1].toString()} ${
          executionFee[0].asset.ticker
        }`}
      </ExecutionFeeTooltipTextWrapper>
    );
  }

  return <></>;
};

export const FeesView: FC<FeesViewProps> = ({
  feeItems,
  executionFee,
  refundableDeposit,
  isLoading,
}) => {
  const [network] = useSelectedNetwork();

  return (
    <>
      {network.name !== 'ergo' && (
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
                  <ExecutionFeeTooltipValue executionFee={executionFee} />
                  {feeItems.map((item, index) => (
                    <Flex.Item
                      display="flex"
                      align="center"
                      key={index}
                      marginBottom={index === feeItems.length - 1 ? 0 : 1}
                    >
                      <Flex.Item marginRight={1}>{item.caption}:</Flex.Item>
                      <Flex.Item align="center" display="flex">
                        {item.fee && !isLoading ? (
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
                  <Flex.Item
                    display="flex"
                    align="center"
                    key={'ui-fee'}
                    marginBottom={1}
                  >
                    <Flex.Item marginRight={1}>{'UI Fee'}:</Flex.Item>
                    <Flex.Item marginRight={1}>
                      <AssetIcon
                        size="extraSmall"
                        asset={feeItems[0]?.fee?.asset}
                      />
                    </Flex.Item>
                    <Flex.Item align="center" display="flex">
                      {`1 ADA`}
                    </Flex.Item>
                  </Flex.Item>
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
          <TotalFeeValue
            feeItems={feeItems}
            executionFee={executionFee}
            isLoading={isLoading}
          />
        }
      />
    </>
  );
};
