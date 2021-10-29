import './Swap.less';

import { Form } from 'antd';
import React from 'react';

import {
  TokenControl,
  TokenControlFormItem,
} from '../../components/TokenControl/TokenControl';
import {
  Box,
  Button,
  HistoryOutlined,
  SettingOutlined,
  SwapOutlined,
  Typography,
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
    <Flex alignItems="center">
      <Box contrast padding={6} className="swap" borderRadius="l">
        <Form>
          <Flex>
            <Flex flexDirection="row" alignItems="center">
              <Flex.Item flex={1}>
                <Typography.Title level={4}>Swap</Typography.Title>
              </Flex.Item>
              <Button size="large" type="text" icon={<SettingOutlined />} />
              <Button size="large" type="text" icon={<HistoryOutlined />} />
            </Flex>
            <Flex.Item marginBottom={6}>
              <Typography.Footnote>Ergo network</Typography.Footnote>
            </Flex.Item>

            <Flex.Item marginBottom={1}>
              <TokenControlFormItem label="From" />
            </Flex.Item>

            <Flex.Item className="swap-button">
              <Button icon={<SwapOutlined />} size="large" />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <TokenControlFormItem label="To" />
            </Flex.Item>

            <Button size="large" type="primary">
              Select a token
            </Button>
          </Flex>
        </Form>
      </Box>
    </Flex>
  );
};
