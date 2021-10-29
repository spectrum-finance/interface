import './PoolPosition.less';

import React from 'react';

import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { Box, Button, Col, Row, Typography } from '../../../ergodex-cdk';
import { ArrowLeftOutlined, PlusOutlined } from '../../../ergodex-cdk';
import { PriceView } from './PriceView';

export const PoolPosition: React.FC = () => {
  const tokenPairs = [
    {
      symbol: 'ERG',
      name: 'Ergo',
      iconName: 'erg-orange',
    },
    {
      symbol: 'ERG',
      name: 'Ergo',
      iconName: 'erg-orange',
    },
  ];

  return (
    <Row align="middle" justify="center">
      <Box>
        <Row align="middle" bottomGutter={4}>
          <Button type="text" icon={<ArrowLeftOutlined />} />
          <Typography.Title level={4}>Position overview</Typography.Title>
        </Row>
        <Box
          borderRadius="m"
          padding={[6, 4]}
          className="position__detail_wrapper"
        >
          <Row align="middle">
            <TokenIcon
              name={tokenPairs[0].iconName ?? tokenPairs[0].symbol ?? 'empty'}
            />
            <TokenIcon
              name={tokenPairs[1].iconName ?? tokenPairs[1].symbol ?? 'empty'}
              style={{ marginLeft: -12 }}
            />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${tokenPairs[0].symbol}/${tokenPairs[1].symbol}`}
            </Typography.Title>
            <Typography.Text className="percent-lbl token-pair">
              0.3%
            </Typography.Text>
          </Row>

          <Row topGutter={4}>
            <Col span={24}>
              <Typography.Text>Liquidity</Typography.Text>
            </Col>
            <Col span={24} style={{ marginTop: 8 }}>
              <Typography.Title level={2}>$6.50</Typography.Title>
            </Col>
            <Col span={24} style={{ marginTop: 8 }}>
              <Row className="liquidity-info__wrapper">
                <Col span={24}>
                  <Row align="middle" justify="space-between">
                    <Row>
                      <TokenIcon
                        width={16}
                        name={
                          tokenPairs[0].iconName ??
                          tokenPairs[0].symbol ??
                          'empty'
                        }
                      />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPairs[0].symbol}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Typography.Title level={5}>0.0009999</Typography.Title>
                      <Typography.Text
                        style={{ marginLeft: 4 }}
                        className="percent-lbl token"
                      >
                        49%
                      </Typography.Text>
                    </Row>
                  </Row>
                  <Row align="middle" justify="space-between" topGutter={4}>
                    <Row>
                      <TokenIcon
                        width={16}
                        name={
                          tokenPairs[1].iconName ??
                          tokenPairs[1].symbol ??
                          'empty'
                        }
                      />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPairs[1].symbol}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Typography.Title level={5}>3.261</Typography.Title>
                      <Typography.Text
                        style={{ marginLeft: 4 }}
                        className="percent-lbl token"
                      >
                        51%
                      </Typography.Text>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row topGutter={4}>
            <Col span={24}>
              <Row align="middle" justify="space-between">
                <Typography.Text>Unclaimed fees</Typography.Text>
                <Button
                  type="primary"
                  size="small"
                  className="collect-fee__btn"
                >
                  Collect fees
                </Button>
              </Row>
            </Col>
            <Col span={24} style={{ marginTop: 8 }}>
              <Typography.Title level={2} className="fee-lbl">
                $0.00
              </Typography.Title>
            </Col>
            <Col span={24} style={{ marginTop: 8 }}>
              <Row className="liquidity-info__wrapper">
                <Col span={24}>
                  <Row align="middle" justify="space-between">
                    <Row>
                      <TokenIcon
                        width={16}
                        name={
                          tokenPairs[0].iconName ??
                          tokenPairs[0].symbol ??
                          'empty'
                        }
                      />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPairs[0].symbol}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Typography.Title level={5}>
                        {'<0.00001'}
                      </Typography.Title>
                    </Row>
                  </Row>
                  <Row align="middle" justify="space-between" topGutter={4}>
                    <Row>
                      <TokenIcon
                        width={16}
                        name={
                          tokenPairs[1].iconName ??
                          tokenPairs[1].symbol ??
                          'empty'
                        }
                      />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPairs[1].symbol}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Typography.Title level={5}>3.261</Typography.Title>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row topGutter={4}>
            <Col span={24}>
              <Typography.Text>Current price</Typography.Text>
            </Col>
            <Col span={24} style={{ marginTop: 10 }}>
              <Row>
                <Col span={12}>
                  <PriceView
                    className="price__wrapper first"
                    price={3029.72}
                    desc="USDT per ERG"
                  />
                </Col>
                <Col span={12}>
                  <PriceView
                    className="price__wrapper second"
                    price={0.0001}
                    desc="ERG per USDT"
                  />
                </Col>
              </Row>
            </Col>

            <Col span={24} style={{ marginTop: 16 }}>
              <Row>
                <Col span={12}>
                  <Box padding={0} className="liquidity-btn__wrapper first">
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                    >
                      Increase liquidity
                    </Button>
                  </Box>
                </Col>
                <Col span={12}>
                  <Box padding={0} className="liquidity-btn__wrapper second">
                    <Button
                      type="default"
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Remove liquidity
                    </Button>
                  </Box>
                </Col>
              </Row>
            </Col>
          </Row>
        </Box>
      </Box>
    </Row>
  );
};
