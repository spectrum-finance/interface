import { Box, Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { formatToUSD } from '../../../../../services/number';
import { renderFractions } from '../../../../../utils/math';
import { LiquidityPoolOrPositionDetailsProps } from '../../../common/types/LiquidityPoolOrPositionDetailsProps';
import { DetailRow, DetailsBox } from '../DetailsBox/DetailsBox';

const StyledButton = styled(Button)`
  width: 100%;
`;

export const PoolOrPositionDetails: FC<
  LiquidityPoolOrPositionDetailsProps<any>
> = ({ poolMapper, item, children }) => {
  const tvl = poolMapper(item).tvl;
  const volume = poolMapper(item).volume;
  const yearlyFeesPercent = poolMapper(item).yearlyFeesPercent;

  const navigate = useNavigate();

  const overviewPool = () => navigate(poolMapper(item).id);

  const navigateToSwap = () => navigate('../../swap');

  return (
    <Box padding={2} bordered={false} transparent={true}>
      <Flex col>
        <DetailRow marginBottom={2}>
          <DetailsBox
            title={<Trans>Total liquidity</Trans>}
            value={
              <Flex col>
                <Flex.Item marginBottom={1} display="flex" justify="flex-end">
                  {poolMapper(item).x.asset.ticker}:{' '}
                  {poolMapper(item).x.toString()}
                </Flex.Item>
                <Flex.Item display="flex" justify="flex-end">
                  {poolMapper(item).y.asset.ticker}:{' '}
                  {poolMapper(item).y.toString()}
                </Flex.Item>
              </Flex>
            }
          />
        </DetailRow>
        <DetailRow marginBottom={2}>{children}</DetailRow>
        <DetailRow marginBottom={2}>
          <DetailsBox
            title={<Trans>Fee</Trans>}
            value={<Trans>{poolMapper(item).poolFee}%</Trans>}
          />
        </DetailRow>
        <DetailRow marginBottom={2}>
          <DetailsBox
            title={<Trans>TVL</Trans>}
            value={
              <Trans>
                {tvl
                  ? formatToUSD(
                      renderFractions(tvl.value, tvl.units.currency.decimals),
                      'abbr',
                    )
                  : '—'}
              </Trans>
            }
          />
        </DetailRow>
        <DetailRow marginBottom={2}>
          <DetailsBox
            title={<Trans>Volume 24H</Trans>}
            value={
              <Trans>
                {volume
                  ? formatToUSD(
                      renderFractions(
                        volume.value,
                        volume.units.currency.decimals,
                      ),
                      'abbr',
                    )
                  : '—'}
              </Trans>
            }
          />
        </DetailRow>
        <DetailRow marginBottom={4}>
          <DetailsBox
            title={<Trans>APR</Trans>}
            value={
              <Trans>{yearlyFeesPercent ? `${yearlyFeesPercent}%` : '—'}</Trans>
            }
          />
        </DetailRow>
        <Flex.Item display="flex" align="center">
          <Flex.Item flex={1} marginRight={2}>
            <ConnectWalletButton analytics={{ location: 'pool-list' }}>
              <StyledButton onClick={navigateToSwap}>
                <Trans>Swap</Trans>
              </StyledButton>
            </ConnectWalletButton>
          </Flex.Item>
          <Flex.Item flex={1}>
            <StyledButton type="primary" onClick={overviewPool}>
              <Trans>Pool Overview</Trans>
            </StyledButton>
          </Flex.Item>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
