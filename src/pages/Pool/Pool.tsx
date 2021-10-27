import React, { useContext } from 'react';

import { WalletContext } from '../../context';
import { Col, Row, Typography } from '../../ergodex-cdk';
import { useAvailablePositions } from '../../hooks/useAvailablePositions';
import { useUTXOs } from '../../hooks/useUTXOs';
import { EmptyPositionsList } from './EmptyPositionsList/EmptyPositionsList';
import { LiquidityPositionsList } from './LiquidityPositionsList/LiquidityPositionsList';
import { LPGuide } from './LPGuide/LPGuide';

const Pool = (): JSX.Element => {
  const { isWalletConnected } = useContext(WalletContext);
  const UTXOs = useUTXOs();
  // TODO:REFACTOR_POSITIONS_AFTER_YOROI_FIX[EDEX-444]
  const positions = useAvailablePositions(UTXOs);

  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Row bottomGutter={4}>
          <Col span={24}>
            <Typography.Title level={4}>Pools overview</Typography.Title>
          </Col>
        </Row>
        <Row bottomGutter={4}>
          <Col span={24}>
            <LPGuide />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {!isWalletConnected || !positions ? (
              <EmptyPositionsList isWalletConnected={isWalletConnected} />
            ) : (
              <LiquidityPositionsList positions={positions} />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export { Pool };
