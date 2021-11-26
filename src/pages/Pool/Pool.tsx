import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { WalletContext } from '../../context';
import { Button, Col, PlusOutlined, Row, Typography } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { availablePools$ } from '../../services/new/pools';
import { EmptyPositionsList } from './EmptyPositionsList/EmptyPositionsList';
import { LiquidityPositionsList } from './LiquidityPositionsList/LiquidityPositionsList';
// import { LPGuide } from './LPGuide/LPGuide';

const Pool = (): JSX.Element => {
  const { isWalletConnected } = useContext(WalletContext);

  const [positions] = useObservable(availablePools$, []);

  const history = useHistory();

  function handleAddLiquidity() {
    history.push('/pool/add');
  }

  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Row bottomGutter={4}>
          <Col span={24}>
            <Typography.Title level={4}>Pools overview</Typography.Title>
          </Col>
        </Row>
        {/*<Row bottomGutter={4}>*/}
        {/*  <Col span={24}>*/}
        {/*    <LPGuide />*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <Row bottomGutter={4}>
          <Col span={24}>
            {!isWalletConnected ? (
              <EmptyPositionsList isWalletConnected={isWalletConnected} />
            ) : (
              <LiquidityPositionsList positions={positions} />
            )}
          </Col>
        </Row>
        <Row>
          {isWalletConnected && (
            <Button
              type="primary"
              size="extra-large"
              onClick={handleAddLiquidity}
              icon={<PlusOutlined />}
              block
            >
              Add Position
            </Button>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export { Pool };
