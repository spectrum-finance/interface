import './Swap.less';

import React, { useState } from 'react';

import { TokenInput } from '../../components/TokenInput/TokenInput';
import { TokenListModal } from '../../components/TokenListModal/TokenListModal';
import {
  Box,
  Button,
  Col,
  HistoryOutlined,
  InfoCircleOutlined,
  Modal,
  Row,
  SettingOutlined,
  Space,
  SwapOutlined,
  Tooltip,
  Typography,
} from '../../ergodex-cdk';

export const Swap: React.FC = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromTokenName, setFromTokenName] = useState('ERG');
  const [fromTokenBalance] = useState(0.02);
  const [fromTokenPrice] = useState(335);
  const [toValue, setToValue] = useState('');
  const [toTokenName, setToTokenName] = useState('');
  const [toTokenBalance] = useState(0.02);
  const [toTokenPrice] = useState(335);

  const handleSelectFromToken = (onSelectChanged: (name: string) => void) => {
    Modal.open(
      ({ close }) => (
        <TokenListModal close={close} onSelectChanged={onSelectChanged} />
      ),
      { title: 'Select a token' },
    );
  };

  const priceTooltip = (
    <>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Minimum received
        </Typography.Text>
        <Typography.Text className="price-content__right">
          0.044WETH
        </Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Price impact
        </Typography.Text>
        <Typography.Text className="price-content__right">0.5%</Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Slippage tollerance
        </Typography.Text>
        <Typography.Text className="price-content__right">0.5%</Typography.Text>
      </Box>
      <Box className="price-content">
        <Typography.Text className="price-content__left">
          Total fees
        </Typography.Text>
        <Typography.Text className="price-content__right">
          0.000055ERG(~$3.065)
        </Typography.Text>
      </Box>
    </>
  );

  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Box className="swap" contrast borderRadius="l" padding={6}>
          <Row bottomGutter={6}>
            <Col span={18}>
              <Typography.Title level={4}>Swap</Typography.Title>
              <Typography.Text className="swap__network">
                Ergo network
              </Typography.Text>
            </Col>
            <Col span={5} offset={1}>
              <Row className="swap__right-top" justify="end">
                <Button size="large" type="text" icon={<SettingOutlined />} />
                <Button size="large" type="text" icon={<HistoryOutlined />} />
              </Row>
            </Col>
          </Row>
          <Row bottomGutter={4}>
            <Col>
              <Row bottomGutter={1}>
                <Col>
                  <TokenInput
                    value={fromValue}
                    onChange={setFromValue}
                    tokenName={fromTokenName}
                    balance={fromTokenBalance}
                    tokenPrice={fromTokenPrice}
                    onSelectToken={() =>
                      handleSelectFromToken(setFromTokenName)
                    }
                    label="From"
                  />
                </Col>
              </Row>
              <Box className="swap__switch-btn-wrapper" transparent>
                <Button
                  className="swap__switch-btn"
                  size="large"
                  icon={<SwapOutlined />}
                />
              </Box>
              <Row>
                <Col>
                  <TokenInput
                    value={toValue}
                    onChange={setToValue}
                    tokenName={toTokenName}
                    balance={toTokenBalance}
                    tokenPrice={toTokenPrice}
                    onSelectToken={() => handleSelectFromToken(setToTokenName)}
                    label="To"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {fromTokenName.length > 0 && toTokenName.length > 0 && (
            <Row bottomGutter={4}>
              <Col>
                <Tooltip
                  placement="left"
                  title={priceTooltip}
                  className="swap__tip"
                  overlayStyle={{ width: '300px', maxWidth: '300px' }}
                >
                  <InfoCircleOutlined className="swap__tip-icon" />
                  <Typography.Text>
                    1{fromTokenName} = 0.00001{toTokenName}
                  </Typography.Text>
                  <Space className="swap__tip-price">
                    <Typography.Text className="swap__tip-price-text">
                      ($1.00306)
                    </Typography.Text>
                  </Space>
                </Tooltip>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24}>
              <Button className="swap__btn" block disabled>
                Select a token
              </Button>
            </Col>
          </Row>
        </Box>
      </Col>
    </Row>
  );
};
