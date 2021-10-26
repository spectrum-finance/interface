import './Swap.less';

import React, { useState } from 'react';

import {
  Button,
  Col,
  HistoryOutlined,
  Row,
  SettingOutlined,
  SwapOutlined,
  TokenInput,
  // TokenListModal,
} from '../../ergodex-cdk';

export const Swap: React.FC = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromTokenName, setFromTokenName] = useState('ERG');
  const [fromTokenBalance, setFromTokenBalance] = useState(0);
  const [fromTokenPrice, setFromTokenPrice] = useState(335);
  const [toValue, setToValue] = useState('');
  const [toTokenName, setToTokenName] = useState('');
  const [toTokenBalance, setToTokenBalance] = useState(0);
  const [toTokenPrice, setToTokenPrice] = useState(335);
  const [showFromTokenListModal, setShowFromTokenListModal] = useState(false);
  const [showToTokenListModal, setShowToTokenListModal] = useState(false);

  const handleSelectFromToken = () => {
    setShowFromTokenListModal(true);
  };

  const handleSelectToToken = () => {
    setShowToTokenListModal(true);
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
              onSelectToken={handleSelectFromToken}
              label="From"
            />
          </div>

          <div className="swap-arrow">
            <Button size="large" icon={<SwapOutlined />} />
          </div>

          {/*<TokenListModal*/}
          {/*  visible={showFromTokenListModal}*/}
          {/*  onCancel={() => setShowFromTokenListModal(false)}*/}
          {/*  onSelectChanged={setFromTokenName}*/}
          {/*/>*/}

          <div className="to-token-input">
            <TokenInput
              value={toValue}
              onChange={setToValue}
              tokenName={toTokenName}
              balance={toTokenBalance}
              tokenPrice={toTokenPrice}
              onSelectToken={handleSelectToToken}
              label="To"
            />
          </div>

          <Button className="bottom-button" size="large">
            Select a token
          </Button>

          {/*<TokenListModal*/}
          {/*  visible={showToTokenListModal}*/}
          {/*  onCancel={() => setShowToTokenListModal(false)}*/}
          {/*  onSelectChanged={setToTokenName}*/}
          {/*/>*/}
        </div>
      </Col>
    </Row>
  );
};
