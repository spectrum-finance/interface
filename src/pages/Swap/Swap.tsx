import './Swap.less';

import React, { useState } from 'react';

import { TokenInput } from '../../components/TokenInput/TokenInput';
import { TokenListModal } from '../../components/TokenListModal/TokenListModal';
import {
  Box,
  Button,
  Col,
  HistoryOutlined,
  Modal,
  Row,
  SettingOutlined,
  SwapOutlined,
  Typography,
} from '../../ergodex-cdk';

export const Swap: React.FC = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromTokenName, setFromTokenName] = useState('ERG');
  const [fromTokenBalance] = useState(0);
  const [fromTokenPrice] = useState(335);
  const [toValue, setToValue] = useState('');
  const [toTokenName, setToTokenName] = useState('');
  const [toTokenBalance] = useState(0);
  const [toTokenPrice] = useState(335);

  const handleSelectFromToken = (onSelectChanged: (name: string) => void) => {
    Modal.open(
      ({ close }) => (
        <TokenListModal close={close} onSelectChanged={onSelectChanged} />
      ),
      { title: 'Select a token' },
    );
  };

  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Box className="swap" formWrapper borderRadius="l" padding={6}>
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
