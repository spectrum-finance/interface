import React from 'react';

import { ReactComponent as Empty } from '../../../assets/icons/empty.svg';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { Box, Button, Col, Row, Typography } from '../../../ergodex-cdk';

interface EmptyPositionsListProps {
  isWalletConnected: boolean;
}

const EmptyPositionsList: React.FC<EmptyPositionsListProps> = ({
  isWalletConnected,
}) => {
  return (
    <Box padding={[7, 2]} borderRadius="m">
      <Row justify="center" align="middle" bottomGutter={3}>
        <Col>
          <Empty />
        </Col>
      </Row>
      <Row justify="center" align="middle" bottomGutter={3}>
        <Col>
          <Typography.Body>
            Your liquidity positions will appear here.
          </Typography.Body>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col>
          {!isWalletConnected ? (
            <ConnectWalletButton />
          ) : (
            <Button type="primary">+ New position</Button>
          )}
        </Col>
      </Row>
    </Box>
  );
};

export { EmptyPositionsList };
