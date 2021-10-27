import React from 'react';

import { Col, Row, Typography } from '../../ergodex-cdk';
import { LiquidityPositionsList } from './LiquidityPositionsList/LiquidityPositionsList';
import { LPGuide } from './LPGuide/LPGuide';

const Pool = (): JSX.Element => {
  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Row bottomGutter={2}>
          <Col span={24}>
            <Typography.Title level={4}>Pools overview</Typography.Title>
          </Col>
        </Row>
        <Row bottomGutter={2}>
          <Col span={24}>
            <LPGuide />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <LiquidityPositionsList />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export { Pool };
