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
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../../components/TableView/common/Expand';
import { ErgoLmPool } from '../../../../network/ergo/api/lmPools/ErgoLmPool';
import { FarmAction } from '../FarmAction/FarmAction';
import { FarmLineProgress } from '../../FarmLineProgress/FarmLineProgress';
import { FarmNextRewards } from '../../FarmNextRewards/FarmNextRewards';

const FullWidthRow = styled(Row)`
  width: 100%;
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
                  <Trans>Distributed</Trans>
                </Typography.Body>
                <Flex.Item marginTop={1} width="100%">
                  <FarmLineProgress lmPool={lmPool} height={24} width="100%" />
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
                    <div>
                      {lmPool.yourStake.every((value) => value.isPositive()) ? (
                        <ConvenientAssetView value={lmPool.yourStake} />
                      ) : (
                        <>$---</>
                      )}
                    </div>
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
            <FarmNextRewards lmPool={lmPool} />
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
          {/* <Box
            width="100%"
            borderRadius="none"
            padding={valBySize([4, 4], [4, 4], [4, 4], [5, 4])}
            bordered={false}
            transparent
          >
            <Flex direction="col">
              <Typography.Body secondary>Rewards</Typography.Body>
              <Typography.Body size="base">
                You will be able to stake starting from 2022-07-20
              </Typography.Body>
            </Flex>
          </Box> */}
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
                <FarmAction lmPool={lmPool} $fullWidth />
              </Flex.Item>
            </Box>
          </Col>
        )}
      </FullWidthRow>
    </Flex>
  );
};
