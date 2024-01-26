import { Divider, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import sum from 'lodash/sum';
import { FC, ReactNode } from 'react';

import { applicationConfig } from '../../../../../../../../applicationConfig.ts';
import { AmmPool } from '../../../../../../../../common/models/AmmPool';
import { AssetIcon } from '../../../../../../../../components/AssetIcon/AssetIcon.tsx';
import { InfoTooltip } from '../../../../../../../../components/InfoTooltip/InfoTooltip';
import { isSpecialBoostedPool } from '../../../../../../../../utils/specialPools.ts';

type AprElement = {
  name: string;
  val: number;
  logo?: ReactNode;
  linkElem?: ReactNode;
};
interface LbspTooltipContentProps {
  readonly aprs: Array<AprElement>;
  readonly totalApr: number;
}

const AprTooltipContent: FC<LbspTooltipContentProps> = ({ aprs, totalApr }) => {
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
      {aprs.map((apr, index) => {
        return (
          <Flex.Item key={`${index}-apr-row`} display="flex">
            <Flex.Item marginRight={1} justify="space-between">
              <Typography.Body tooltip size="small">
                {apr.name}
              </Typography.Body>
            </Flex.Item>
            {apr.logo ? (
              <Flex.Item display="flex" align="center" flex={1}>
                <Flex.Item marginRight={1}>{apr.logo}</Flex.Item>
                <Flex.Item marginRight={1}>
                  <Typography.Body tooltip strong>
                    {apr.val ? apr.val.toFixed(2) : '--'}%
                  </Typography.Body>
                </Flex.Item>
              </Flex.Item>
            ) : (
              <Flex.Item flex={1}>
                <Typography.Body tooltip strong>
                  {apr.val ? apr.val.toFixed(2) : '--'}%
                </Typography.Body>
              </Flex.Item>
            )}
          </Flex.Item>
        );
      })}
    </Flex>
  );
};

export interface CardanoAprColumnContent {
  readonly ammPool: AmmPool;
  readonly isAllContentTrigger?: boolean;
}

const CardanoLbspAmmPoolAprColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
  isAllContentTrigger,
}) => {
  const swapApr = ammPool.yearlyFeesPercent || 0;

  const aprs: Array<AprElement> = [
    {
      name: t`Trading Fees:`,
      val: swapApr,
    },
  ];

  if (isSpecialBoostedPool(ammPool.id)) {
    aprs.push({
      name: t`Boosted APR:`,
      val: applicationConfig.specialRewardsPct[ammPool.id],
      logo: <AssetIcon asset={ammPool.y.asset} size="extraSmall" />,
    });
  }

  const totalApr = sum(aprs.map((v) => v.val));

  return (
    <>
      {totalApr ? (
        <Flex align="center">
          {isSpecialBoostedPool(ammPool.id) && (
            <Flex.Item marginRight={1}>
              <AssetIcon asset={ammPool.y.asset} size="extraSmall" />
            </Flex.Item>
          )}
          <InfoTooltip
            width={200}
            placement="top"
            isAllContentTrigger={isAllContentTrigger}
            content={<AprTooltipContent aprs={aprs} totalApr={totalApr} />}
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

export const CardanoStandardAmmPoolArColumnContent: FC<CardanoAprColumnContent> =
  ({ ammPool }) => (
    <>{ammPool.yearlyFeesPercent ? `${ammPool.yearlyFeesPercent}%` : '—'}</>
  );

export const CardanoAprColumnContent: FC<CardanoAprColumnContent> = ({
  ammPool,
  isAllContentTrigger,
}) => {
  return (
    <>
      {isSpecialBoostedPool(ammPool.id) ? (
        <CardanoLbspAmmPoolAprColumnContent
          isAllContentTrigger={isAllContentTrigger}
          ammPool={ammPool}
        />
      ) : (
        <CardanoStandardAmmPoolArColumnContent
          ammPool={ammPool}
          isAllContentTrigger={isAllContentTrigger}
        />
      )}
    </>
  );
};
