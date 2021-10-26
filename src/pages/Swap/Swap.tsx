import './Swap.less';

import React, { useState } from 'react';

import { TokenListModal } from '../../components/TokenListModal/TokenListModal';
import {
  Button,
  Col,
  HistoryOutlined,
  Modal,
  Row,
  SettingOutlined,
  SwapOutlined,
  TokenInput,
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
      <Col>
        <div className="swap-form">
          <div className="swap-header">
            <span className="form-title">Swap</span>
            <span className="network-name">Ergo network</span>

            <div className="top-right">
              <Button size="large" type="text" icon={<SettingOutlined />} />
              <Button size="large" type="text" icon={<HistoryOutlined />} />
            </div>
          </div>

          <div className="from-token-input">
            <TokenInput
              value={fromValue}
              onChange={setFromValue}
              tokenName={fromTokenName}
              balance={fromTokenBalance}
              tokenPrice={fromTokenPrice}
              onSelectToken={() => handleSelectFromToken(setFromTokenName)}
              label="From"
            />
          </div>

          <div className="swap-arrow">
            <Button size="large" icon={<SwapOutlined />} />
          </div>

          <div className="to-token-input">
            <TokenInput
              value={toValue}
              onChange={setToValue}
              tokenName={toTokenName}
              balance={toTokenBalance}
              tokenPrice={toTokenPrice}
              onSelectToken={() => handleSelectFromToken(setToTokenName)}
              label="To"
            />
          </div>

          <Button className="bottom-button" size="large" disabled>
            Select a token
          </Button>
        </div>
      </Col>
    </Row>
  );
};
