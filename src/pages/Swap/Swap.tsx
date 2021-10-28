import './Swap.less';

import { Card } from 'antd';
import React, { useState } from 'react';

import { TokenInput } from '../../components/TokenInput/TokenInput';
import {
  Box,
  Button,
  Col,
  HistoryOutlined,
  Input,
  Row,
  SettingOutlined,
  SwapOutlined,
  Typography,
  // TokenListModal,
} from '../../ergodex-cdk';
import { Flex } from '../../ergodex-cdk/components/Flex/Flex';

// export const Swap: React.FC = () => {
//   const [fromValue, setFromValue] = useState('');
//   const [fromTokenName, setFromTokenName] = useState('ERG');
//   const [fromTokenBalance, setFromTokenBalance] = useState(0);
//   const [fromTokenPrice, setFromTokenPrice] = useState(335);
//   const [toValue, setToValue] = useState('');
//   const [toTokenName, setToTokenName] = useState('');
//   const [toTokenBalance, setToTokenBalance] = useState(0);
//   const [toTokenPrice, setToTokenPrice] = useState(335);
//   const [showFromTokenListModal, setShowFromTokenListModal] = useState(false);
//   const [showToTokenListModal, setShowToTokenListModal] = useState(false);
//
//   const handleSelectFromToken = () => {
//     setShowFromTokenListModal(true);
//   };
//
//   const handleSelectToToken = () => {
//     setShowToTokenListModal(true);
//   };
//
//   return (
//     <Row align="middle" justify="center">
//       <Col>
//         <div className="swap-form">
//           <div className="swap-header">
//             <span className="form-title">Swap</span>
//             <span className="network-name">Ergo network</span>
//
//             <div className="top-right">
//               <Button size="large" type="text" icon={<SettingOutlined />} />
//               <Button size="large" type="text" icon={<HistoryOutlined />} />
//             </div>
//           </div>
//
//           <div className="from-token-input">
//             <TokenInput
//               value={fromValue}
//               onChange={setFromValue}
//               tokenName={fromTokenName}
//               balance={fromTokenBalance}
//               tokenPrice={fromTokenPrice}
//               onSelectToken={handleSelectFromToken}
//               label="From"
//             />
//           </div>
//
//           <div className="swap-arrow">
//             <Button size="large" icon={<SwapOutlined />} />
//           </div>
//
//           {/*<TokenListModal*/}
//           {/*  visible={showFromTokenListModal}*/}
//           {/*  onCancel={() => setShowFromTokenListModal(false)}*/}
//           {/*  onSelectChanged={setFromTokenName}*/}
//           {/*/>*/}
//
//           <div className="to-token-input">
//             <TokenInput
//               value={toValue}
//               onChange={setToValue}
//               tokenName={toTokenName}
//               balance={toTokenBalance}
//               tokenPrice={toTokenPrice}
//               onSelectToken={handleSelectToToken}
//               label="To"
//             />
//           </div>
//
//           <Button className="bottom-button" size="large">
//             Select a token
//           </Button>
//
//           {/*<TokenListModal*/}
//           {/*  visible={showToTokenListModal}*/}
//           {/*  onCancel={() => setShowToTokenListModal(false)}*/}
//           {/*  onSelectChanged={setToTokenName}*/}
//           {/*/>*/}
//         </div>
//       </Col>
//     </Row>
//   );
// };

export const Swap = () => {
  return (
    <Card>
      <Flex>
        <Flex flexDirection="row" alignItems="center">
          <Flex.Item flex={1}>
            <Typography.Title level={4}>Swap</Typography.Title>
          </Flex.Item>
          <Button size="large" type="link" icon={<SettingOutlined />} />
          <Button size="large" type="link" icon={<HistoryOutlined />} />
        </Flex>
        <Flex.Item bottomGutter={3}>
          <Typography.Footnote>Ergo network</Typography.Footnote>
        </Flex.Item>

        <Flex.Item bottomGutter={0.5}>
          <Box>
            <Flex>
              <Flex.Item bottomGutter={1}>
                <Typography.Body type="secondary">From</Typography.Body>
              </Flex.Item>
              <Flex.Item bottomGutter={1}>
                <Input />
              </Flex.Item>
              <Flex flexDirection="row" alignItems="center">
                <Flex.Item rightGutter={1}>
                  <Typography.Body>Balance: 0.02 ERG</Typography.Body>
                </Flex.Item>
                <Button ghost type="primary">
                  Max
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex.Item>

        <Flex.Item bottomGutter={0.5}>
          <Box>
            <Flex>
              <Flex.Item bottomGutter={1}>
                <Typography.Body type="secondary">To</Typography.Body>
              </Flex.Item>
              <Flex.Item bottomGutter={5}>
                <Input />
              </Flex.Item>
            </Flex>
          </Box>
        </Flex.Item>
      </Flex>
    </Card>
  );
};
