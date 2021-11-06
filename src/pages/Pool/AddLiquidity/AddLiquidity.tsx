import './AddLiquidity.less';

import cn from 'classnames';
import React, { useState } from 'react';

import { TokenListModal } from '../../../components/common/TokenControl/TokenSelect/TokenListModal/TokenListModal';
import { PoolMenu } from '../../../components/PoolMenu/PoolMenu';
import {
  Box,
  Button,
  Col,
  DisconnectOutlined,
  Modal,
  Row,
  SearchOutlined,
  SettingOutlined,
  Space,
  Typography,
} from '../../../ergodex-cdk';

const AddLiquidity = (): JSX.Element => {
  const [fromValue, setFromValue] = useState('');
  const [fromTokenName, setFromTokenName] = useState('ERG');
  const [fromTokenBalance] = useState(0.02);
  const [fromTokenPrice] = useState(335);
  const [toValue, setToValue] = useState('');
  const [toTokenName, setToTokenName] = useState('');
  const [toTokenBalance] = useState(0.02);
  const [toTokenPrice] = useState(335);
  const [isSticked, setSticked] = useState(0);

  const handleSelectFromToken = (onSelectChanged: (name: string) => void) => {
    Modal.open(
      ({ close }) => (
        <TokenListModal close={close} onSelectChanged={onSelectChanged} />
      ),
      { title: 'Select a token' },
    );
  };

  const stickState = () => {
    if (isSticked == 0) setSticked(1);
    else setSticked(0);
  };

  return (
    <Row align="middle" justify="center">
      <Col span={7}>
        <Box className="liquidity" contrast borderRadius="l" padding={6}>
          <Row bottomGutter={0}>
            <Col span={14}>
              <Typography.Title level={5}>Select pair</Typography.Title>
            </Col>
            <Col span={9} offset={1}>
              <Row className="liquidity__right-top" justify="end">
                <Button className="liquidity__right-top--clear-all" type="link">
                  Clear all
                </Button>
                <Button
                  className="liquidity__right-top--setting"
                  size="large"
                  type="text"
                  icon={<SettingOutlined />}
                />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Space className="liquidity__input-select" size={10}>
                {/*<TokenSelect*/}
                {/*  name={fromTokenName}*/}
                {/*  onTokenSelect={() => handleSelectFromToken(setFromTokenName)}*/}
                {/*  className="liquidity__input-select-content"*/}
                {/*/>*/}
                {/*<TokenSelect*/}
                {/*  name={toTokenName}*/}
                {/*  onTokenSelect={() => handleSelectFromToken(setToTokenName)}*/}
                {/*  className="liquidity__input-select-content"*/}
                {/*/>*/}
              </Space>
            </Col>
          </Row>
          <Row>
            <Typography.Title level={5} className="liquidity__pool-title">
              Pool
            </Typography.Title>
            <PoolMenu
              className="liquidity__pool"
              fromToken={fromTokenName}
              toToken={toTokenName}
              percent={0.5}
              disable={toTokenName.length == 0}
            />
          </Row>
          <Row bottomGutter={4} className="liquidity__stick">
            <Typography.Title
              level={5}
              className="liquidity__liquidity-title"
              disabled={toTokenName.length == 0}
            >
              Liquidity
            </Typography.Title>
            <Col>
              <Row bottomGutter={1}>
                <Col>
                  {/*<TokenInput*/}
                  {/*  className={cn('liquidity__stick-input', {*/}
                  {/*    sticked: isSticked,*/}
                  {/*  })}*/}
                  {/*  value={fromValue}*/}
                  {/*  onChange={setFromValue}*/}
                  {/*  tokenName={fromTokenName}*/}
                  {/*  balance={fromTokenBalance}*/}
                  {/*  tokenPrice={fromTokenPrice}*/}
                  {/*  onSelectToken={() => {}}*/}
                  {/*  label=""*/}
                  {/*  disable={toTokenName.length == 0}*/}
                  {/*/>*/}
                </Col>
              </Row>
              <Box className="liquidity__stick-btn-wrapper" transparent>
                <Button
                  className="liquidity__stick-btn"
                  size="middle"
                  icon={<DisconnectOutlined />}
                  onClick={stickState}
                  disabled={toTokenName.length == 0}
                />
              </Box>
              <Row>
                <Col>
                  {/*<TokenInput*/}
                  {/*  className={cn('liquidity__stick-input', {*/}
                  {/*    sticked: isSticked,*/}
                  {/*  })}*/}
                  {/*  value={toValue}*/}
                  {/*  onChange={setToValue}*/}
                  {/*  tokenName={toTokenName}*/}
                  {/*  balance={toTokenBalance}*/}
                  {/*  tokenPrice={toTokenPrice}*/}
                  {/*  onSelectToken={() => {}}*/}
                  {/*  label=""*/}
                  {/*  disable={toTokenName.length == 0}*/}
                  {/*/>*/}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {isSticked ? (
                <Button
                  className="liquidity__btn"
                  block
                  loading
                  icon={<SearchOutlined />}
                >
                  Wait a second
                </Button>
              ) : (
                <Button className="liquidity__btn" block disabled>
                  Select a token
                </Button>
              )}
            </Col>
          </Row>
        </Box>
      </Col>
    </Row>
  );
};
export { AddLiquidity };
