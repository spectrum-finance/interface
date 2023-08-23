import { Divider, Flex, Modal, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { useObservable } from '../../../../../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../../../../../common/models/AmmPool';
import { InfoTooltip } from '../../../../../../../../components/InfoTooltip/InfoTooltip';
import { LbspFaqModal } from '../../../../../../../../components/LbspFaqModal/LbspFaqModal.tsx';
import { SpfLogo } from '../../../../../../../../components/SpfLogo/SpfLogo.tsx';
import { isLbspAmmPool } from '../../../../../../../../utils/lbsp.ts';
import { calculateLbspApr } from './calculateLbspApr';

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
    <Flex col width={200}>
      <Typography.Body tooltip>
        <Trans>Total APR</Trans>
      </Typography.Body>
      <Typography.Body size="large" tooltip strong>
        {totalApr.toFixed(2)}%
      </Typography.Body>
      <Flex.Item marginTop={1} marginBottom={1}>
        <Divider />
      </Flex.Item>
      <Flex.Item display="flex" marginBottom={1}>
        <Flex.Item width={65} marginRight={1}>
          <Typography.Body tooltip size="small">
            <Trans>Swap Fees:</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item flex={1}>
          <Typography.Body tooltip strong>
            {swapApr ? `${swapApr.toFixed(2)}%` : '—'}
          </Typography.Body>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item display="flex">
        <Flex.Item width={65}>
          <Typography.Body tooltip size="small">
            <Trans>LBSP APR:</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item display="flex" align="center" flex={1}>
          <Flex.Item marginRight={1}>
            <SpfLogo w={16} h={16} block />
          </Flex.Item>

          <Flex.Item marginRight={1}>
            <Typography.Body tooltip strong>
              {lbspApr ? `${lbspApr.toFixed(2)}%` : '—'}
            </Typography.Body>
          </Flex.Item>

          <Typography.Link
            style={{
              color: 'var(--spectrum-hint-text)',
              textDecoration: 'underline',
              fontSize: '10px',
            }}
            onClick={(event) => {
              event.stopPropagation();
              Modal.open(() => <LbspFaqModal />);
            }}
          >
            Read more
          </Typography.Link>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body
          size="small"
          style={{ color: 'var(--spectrum-hint-text)' }}
        >
          LBSP APR is calculated according to the current SPF price on the Ergo
          market
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};

export interface CardanoAprColumnContent {
  readonly ammPool: AmmPool;
  readonly isAllContentTrigger?: boolean;
}

const CardanoLbspAmmPoolArColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
  isAllContentTrigger,
}) => {
  const [lbspApr] = useObservable(calculateLbspApr(ammPool), [], 0);
  const swapApr = ammPool.yearlyFeesPercent || 0;
  const totalApr = swapApr + lbspApr;

  return (
    <>
      {totalApr ? (
        <Flex align="center">
          <Flex.Item marginRight={1}>
            <SpfLogo w={16} h={16} block />
          </Flex.Item>
          <InfoTooltip
            width={200}
            placement="top"
            isAllContentTrigger={isAllContentTrigger}
            content={
              <LbspTooltipContent
                totalApr={totalApr}
                lbspApr={lbspApr}
                swapApr={swapApr}
              />
            }
          >
            {totalApr.toFixed(2)}%
          </InfoTooltip>
        </Flex>
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
  isAllContentTrigger,
}) => {
  if (isLbspAmmPool(ammPool.id)) {
    return (
      <CardanoLbspAmmPoolArColumnContent
        isAllContentTrigger={isAllContentTrigger}
        ammPool={ammPool}
      />
    );
  } else {
    return <CardanoStandardAmmPoolArColumnContent ammPool={ammPool} />;
  }
};
