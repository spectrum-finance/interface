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

import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ExpandComponentProps } from '../../../components/TableView/common/Expand';
import { LineProgress } from '../LineProgress/LineProgress';

const FullWidthRow = styled(Row)`
  width: 100%;
`;

const FullWidthButton = styled(Button)`
  width: ${({ fullWidth }: { fullWidth?: boolean }) =>
    fullWidth ? '100%' : 'normal'};
`;

export const FarmTableExpandComponent: FC<ExpandComponentProps<any>> = ({
  item,
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
                      $340k{' '}
                      <InfoTooltip
                        width={194}
                        size="small"
                        placement="top"
                        icon="exclamation"
                        content={
                          <div>
                            <div>ERG: 314,756.66</div>
                            <div>SFP: 314,756.66</div>
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
                  <Typography.Body>$340k </Typography.Body>
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
                2022-07-20{' '}
                <Typography.Body secondary>
                  <SwapRightOutlined disabled={true} />
                </Typography.Body>{' '}
                2022-07-21
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
              <Typography.Body>30 days (134,567 blocks)</Typography.Body>
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
            <Flex
              align={valBySize(
                'flex-start',
                'flex-start',
                'flex-start',
                'center',
              )}
              justify="space-between"
              width="100%"
              direction={valBySize('col', 'col', 'col', 'row')}
              gap={valBySize(4, 4, 4, 0)}
            >
              <Flex direction="col">
                <Typography.Body secondary>Rewards</Typography.Body>
                <Typography.Body size="base">
                  You will be able to stake starting from 2022-07-20
                </Typography.Body>
              </Flex>
              <Flex
                align="center"
                width={valBySize('100%', '100%', '100%', 'initial')}
              >
                <FullWidthButton
                  type="primary"
                  disabled
                  fullWidth={valBySize(true, true, true, false)}
                >
                  Harvest
                </FullWidthButton>
              </Flex>
            </Flex>
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
                <FullWidthButton type="primary" disabled fullWidth={true}>
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
