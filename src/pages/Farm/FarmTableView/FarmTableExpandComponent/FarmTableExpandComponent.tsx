import { blocksToDaysCount } from '@ergolabs/ergo-dex-sdk';
import {
  Box,
  Button,
  Col,
  Flex,
  Row,
  SwapRightOutlined,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { blockToDateTime } from '../../../../common/utils/blocks';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';
import { ErgoLmPool } from '../../../../network/ergo/api/lmPools/ErgoLmPool';
import { LineProgress } from '../../LineProgress/LineProgress';

const FullWidthRow = styled(Row)`
  width: 100%;
`;

const FullWidthButton = styled(Button)`
  width: ${({ $fullWidth }: { $fullWidth?: boolean }) =>
    $fullWidth ? '100%' : 'normal'};
`;

export const FarmTableExpandComponent: FC<ExpandComponentProps<ErgoLmPool>> = ({
  item: lmPool,
}) => {
  const { valBySize, lessThan } = useDevice();
  return (
    <Flex>
      <FullWidthRow>
        {lessThan('m') && (
          <Col span={24}>
            <Box
              width="100%"
              borderRadius="none"
              padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
              bordered={false}
              transparent
            >
              <Flex direction="col">
                <Typography.Body secondary>
                  <InfoTooltip
                    width={194}
                    placement="top"
                    content={
                      <Trans>
                        345 Neta out of 1000 Neta have already been distributed
                      </Trans>
                    }
                  >
                    Distributed{' '}
                  </InfoTooltip>
                </Typography.Body>
                <Flex.Item marginTop={1} width="100%">
                  <LineProgress percent={60} height={24} width="100%" />
                </Flex.Item>
              </Flex>
            </Box>
          </Col>
        )}
        {lessThan('xl') && (
          <>
            <Col span={12}>
              <Box
                width="100%"
                borderRadius="none"
                padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
                bordered={false}
                transparent
              >
                <Flex direction="col">
                  <Typography.Body secondary>Total staked</Typography.Body>
                  <Typography.Body>
                    <Flex gap={1} align="center">
                      <ConvenientAssetView value={lmPool.shares} />
                      <InfoTooltip
                        width={194}
                        size="small"
                        placement="top"
                        icon="exclamation"
                        content={
                          <div>
                            <div>
                              {lmPool.shares[0].asset.ticker}:{' '}
                              {lmPool.shares[0].toString()}
                            </div>
                            <div>
                              {lmPool.shares[1].asset.ticker}:{' '}
                              {lmPool.shares[1].toString()}
                            </div>
                          </div>
                        }
                      />
                    </Flex>
                  </Typography.Body>
                </Flex>
              </Box>
            </Col>
            <Col span={12}>
              <Box
                width="100%"
                borderRadius="none"
                padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
                bordered={false}
                transparent
              >
                <Flex direction="col">
                  <Typography.Body secondary>
                    <Trans>Your Stake</Trans>
                  </Typography.Body>
                  <Typography.Body>
                    {lmPool.yourStake.every((value) => value.isPositive()) ? (
                      <ConvenientAssetView value={lmPool.yourStake} />
                    ) : (
                      <>$---</>
                    )}
                  </Typography.Body>
                </Flex>
              </Box>
            </Col>
          </>
        )}
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
            bordered={false}
            transparent
          >
            <Flex direction="col">
              <Typography.Body secondary>Live period</Typography.Body>
              <Typography.Body>
                {blockToDateTime(
                  lmPool.currentHeight,
                  lmPool.config.programStart,
                ).toFormat('yyyy-MM-dd HH:MM')}{' '}
                <Typography.Body secondary>
                  <SwapRightOutlined disabled={true} />
                </Typography.Body>{' '}
                {blockToDateTime(
                  lmPool.currentHeight,
                  lmPool.config.programStart +
                    lmPool.config.epochLen * lmPool.config.epochNum,
                ).toFormat('yyyy-MM-dd HH:MM')}
              </Typography.Body>
            </Flex>
          </Box>
        </Col>
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
            bordered={false}
            transparent
          >
            <Flex direction="col">
              <Typography.Body secondary>
                Next distribution rewards
              </Typography.Body>
              <Typography.Body>
                You will be able to see next rewards starting from 2022-07-20
              </Typography.Body>
            </Flex>
          </Box>
        </Col>
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
            bordered={false}
            transparent
          >
            <Flex direction="col">
              <Typography.Body secondary>
                Distribution frequency
              </Typography.Body>
              <Typography.Body>
                {blocksToDaysCount(lmPool.config.epochLen)} days (
                {lmPool.config.epochLen} blocks)
              </Typography.Body>
            </Flex>
          </Box>
        </Col>
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
            bordered={false}
            transparent
          >
            <Typography.Body secondary>Rewards</Typography.Body>
            <Typography.Body size="base">
              You will be able to stake starting from 2022-07-20
            </Typography.Body>
          </Box>
        </Col>

        {lessThan('m') && (
          <Col span={24}>
            <Box
              width="100%"
              borderRadius="none"
              padding={[4, 4]}
              bordered={false}
              transparent
            >
              <Flex.Item marginTop={1} width="100%">
                <FullWidthButton type="primary" disabled $fullWidth={true}>
                  <Trans>Stake</Trans>
                </FullWidthButton>
              </Flex.Item>
            </Box>
          </Col>
        )}
      </FullWidthRow>
    </Flex>
  );
};
