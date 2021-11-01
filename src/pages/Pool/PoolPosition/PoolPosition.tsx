import './PoolPosition.less';

import React from 'react';
import { useParams } from 'react-router-dom';

import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Col,
  Flex,
  PlusOutlined,
  Row,
  Typography,
} from '../../../ergodex-cdk';
import { useAvailablePositions } from '../../../hooks/useAvailablePositions';
import { useUTXOs } from '../../../hooks/useUTXOs';
import { getPoolFee } from '../../../services/pool';
import { PriceView } from './PriceView';

interface URLParamTypes {
  poolId: string;
}

export const PoolPosition: React.FC = () => {
  const UTXOs = useUTXOs();
  const positions = useAvailablePositions(UTXOs);

  const params = useParams<URLParamTypes>();
  const position = positions?.find((position) => {
    return position.id === params.poolId;
  });

  const tokenPair = {
    tokenA: position?.assetX.name ? position.assetX.name : '',
    tokenB: position?.assetY.name ? position.assetY.name : '',
  };

  console.log('position: ', position);

  return (
    <FormPageWrapper title="Position overview" width={480} withBackButton>
      {position && (
        <>
          <Row align="middle">
            <TokenIconPair tokenPair={tokenPair} />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${tokenPair.tokenA} / ${tokenPair.tokenB}`}
            </Typography.Title>
            <Typography.Text className="percent-lbl token-pair">
              {getPoolFee(position.feeNum)}%
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
                      <TokenIcon width={16} name={tokenPair.tokenA} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenA}
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
                      <TokenIcon width={16} name={tokenPair.tokenB} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenB}
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
                      <TokenIcon width={16} name={tokenPair.tokenA} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenA}
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
                      <TokenIcon width={16} name={tokenPair.tokenB} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenB}
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
                    desc={`${tokenPair.tokenB} per ${tokenPair.tokenA}`}
                  />
                </Col>
                <Col span={12}>
                  <PriceView
                    className="price__wrapper second"
                    price={0.0001}
                    desc={`${tokenPair.tokenA} per ${tokenPair.tokenB}`}
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
        </>
      )}
    </FormPageWrapper>
  );
};
