import { Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { applicationConfig } from '../../../../../../../../applicationConfig';
import { useObservable } from '../../../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../../../common/models/AmmPool';
import { InfoTooltip } from '../../../../../../../../components/InfoTooltip/InfoTooltip';
import { calculateLbspApr } from './calculateLbspApr';

const isLbspPool = (poolId: string): boolean =>
  applicationConfig.lbspLiquidityPools.includes(poolId);

interface LbspTooltipContentProps {
  readonly swapApr: number;
  readonly lbspApr: number;
  readonly totalApr: number;
}

const LbspTooltipContent: FC<LbspTooltipContentProps> = ({
  lbspApr,
  totalApr,
  swapApr,
}) => {
  return (
    <Flex col width={184}>
      <Typography.Body tooltip>
        <Trans>Total APR</Trans>
      </Typography.Body>
      <Typography.Body size="large" tooltip strong>
        {totalApr}%
      </Typography.Body>
      <Flex.Item marginTop={1} marginBottom={1}>
        <Divider />
      </Flex.Item>
      <Flex.Item display="flex" marginBottom={1}>
        <Flex.Item width={65} marginRight={1}>
          <Typography.Body tooltip strong>
            {swapApr ? `${swapApr}%` : '—'}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Typography.Body tooltip size="small">
            <Trans>Swap fees APR 24h</Trans>
          </Typography.Body>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item display="flex">
        <Flex.Item width={65} marginRight={1}>
          <Typography.Body tooltip strong>
            {lbspApr ? `${lbspApr}%` : '—'}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Typography.Body tooltip size="small">
            <Trans>LBSP APR</Trans>
          </Typography.Body>
        </Flex.Item>
      </Flex.Item>
    </Flex>
  );
};

export interface CardanoAprColumnContent {
  readonly ammPool: AmmPool;
}

const CardanoLbspAmmPoolArColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
}) => {
  const [lbspApr] = useObservable(calculateLbspApr(ammPool), [], 0);
  const swapApr = ammPool.yearlyFeesPercent || 0;
  const totalApr = swapApr + lbspApr;

  return (
    <>
      {totalApr ? (
        <InfoTooltip
          width={200}
          placement="top"
          content={
            <LbspTooltipContent
              totalApr={totalApr}
              lbspApr={lbspApr}
              swapApr={swapApr}
            />
          }
        >
          {totalApr}%
        </InfoTooltip>
      ) : (
        '—'
      )}
    </>
  );
};

const CardanoStandardAmmPoolArColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
}) => <>{ammPool.yearlyFeesPercent ? `${ammPool.yearlyFeesPercent}%` : '—'}</>;

export const CardanoAprColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
}) => {
  if (isLbspPool(ammPool.id)) {
    return <CardanoLbspAmmPoolArColumnContent ammPool={ammPool} />;
  } else {
    return <CardanoStandardAmmPoolArColumnContent ammPool={ammPool} />;
  }
};
