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
import React, { FC } from 'react';
import styled from 'styled-components';

import { ExpandComponentProps } from '../../../components/TableView/common/Expand';

const FullWidthRow = styled(Row)`
  width: 100%;
`;

export const FarmTableExpandComponent: FC<ExpandComponentProps<any>> = ({
  item,
}) => {
  const { valBySize, size } = useDevice();
  return (
    <Flex>
      <FullWidthRow>
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={[5, 4]}
            bordered={false}
            transparent
            height={80}
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
            padding={[5, 4]}
            bordered={false}
            transparent
            height={80}
          >
            <Flex direction="col">
              <Typography.Body secondary>
                Next distribution rewards
              </Typography.Body>
              <Typography.Body>
                Provide liquidity and earn rewards in Neta
              </Typography.Body>
            </Flex>
          </Box>
        </Col>
        <Col span={12}>
          <Box
            width="100%"
            borderRadius="none"
            padding={[5, 4]}
            bordered={false}
            transparent
            height={80}
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
            padding={[5, 4]}
            bordered={false}
            transparent
            height={80}
          >
            <Flex align="center" justify="space-between" width="100%">
              <Flex direction="col">
                <Typography.Body secondary>Rewards</Typography.Body>
                <Typography.Body>
                  Provide liquidity and earn rewards in Neta
                </Typography.Body>
              </Flex>
              <Flex align="center">
                <Button type="primary" disabled>
                  Harvest
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Col>
      </FullWidthRow>
    </Flex>
  );
};
