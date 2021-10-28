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

interface DialogRef<T = any> {
  close: (result?: T) => void;
}

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
      (param: DialogRef) => (
        <TokenListModal close={param.close} onSelectChanged={onSelectChanged} />
      ),
      { title: 'Select a token' },
    );
  };

  return (
    <Row align="middle" justify="center">
      <Col className="swap-frame">
        <Box className="swap-form" padding={6}>
          <Box className="swap-header" padding={0}>
            <Typography.Text className="form-title">Swap</Typography.Text>
            <Typography.Text className="network-name">
              Ergo network
            </Typography.Text>

            <Box className="top-right" padding={0}>
              <Button size="large" type="text" icon={<SettingOutlined />} />
              <Button size="large" type="text" icon={<HistoryOutlined />} />
            </Box>
          </Box>

          <Box className="from-token-input" padding={0}>
            <TokenInput
              value={fromValue}
              onChange={setFromValue}
              tokenName={fromTokenName}
              balance={fromTokenBalance}
              tokenPrice={fromTokenPrice}
              onSelectToken={() => handleSelectFromToken(setFromTokenName)}
              label="From"
            />
          </Box>

          <Box className="swap-arrow" padding={0}>
            <Button size="large" icon={<SwapOutlined />} />
          </Box>

          <Box className="to-token-input" padding={0}>
            <TokenInput
              value={toValue}
              onChange={setToValue}
              tokenName={toTokenName}
              balance={toTokenBalance}
              tokenPrice={toTokenPrice}
              onSelectToken={() => handleSelectFromToken(setToTokenName)}
              label="To"
            />
          </Box>

          <Button className="bottom-button" size="large" disabled>
            Select a token
          </Button>
        </Box>
      </Col>
    </Row>
  );
};
