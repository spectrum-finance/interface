import './PoolPosition.less';

import { AmmPool, PoolId } from '@ergolabs/ergo-dex-sdk';
import React from 'react';
import { useParams } from 'react-router-dom';

import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Flex,
  PlusOutlined,
  Typography,
} from '../../../ergodex-cdk';
import { useAvailablePositions } from '../../../hooks/useAvailablePositions';
import { useUTXOs } from '../../../hooks/useUTXOs';
import { getPoolFee } from '../../../services/pool';
import { PriceView } from './PriceView';

interface URLParamTypes {
  poolId: PoolId;
}

export const PoolPosition: React.FC = () => {
  const usePosition = (poolId: PoolId): AmmPool | undefined => {
    const UTXOs = useUTXOs();
    const positions = useAvailablePositions(UTXOs);
    return positions?.find((position) => position.id === poolId);
  };

  const params = useParams<URLParamTypes>();
  const position = usePosition(params.poolId);

  const tokenPair = {
    tokenA: position?.assetX.name ? position.assetX.name : '',
    tokenB: position?.assetY.name ? position.assetY.name : '',
  };

  // console.log('position: ', position);
  // console.log('priceX: ', position?.priceX);
  // console.log('priceY: ', position?.priceY);

  return (
    <FormPageWrapper title="Position overview" width={480} withBackButton>
      {position && (
        <>
          <Flex alignItems="center">
            <TokenIconPair tokenPair={tokenPair} />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${tokenPair.tokenA} / ${tokenPair.tokenB}`}
            </Typography.Title>
            <Typography.Text className="percent-lbl token-pair">
              {getPoolFee(position.feeNum)}%
            </Typography.Text>
          </Flex>

          <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Typography.Text>Liquidity</Typography.Text>
            {/* <Typography.Title level={2} style={{ marginTop: 8 }}>
              $6.50
            </Typography.Title> */}
            <Flex flexDirection="col" className="liquidity-info__wrapper">
              <Flex justify="space-between">
                <Flex>
                  <TokenIcon width={16} name={tokenPair.tokenA} />
                  <Typography.Title level={5} style={{ marginLeft: 4 }}>
                    {tokenPair.tokenA}
                  </Typography.Title>
                </Flex>
                <Flex>
                  <Typography.Title level={5}>0.0009999</Typography.Title>
                  <Typography.Text
                    style={{ marginLeft: 4 }}
                    className="percent-lbl token"
                  >
                    49%
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex justify="space-between" style={{ marginTop: 16 }}>
                <Flex>
                  <TokenIcon width={16} name={tokenPair.tokenB} />
                  <Typography.Title level={5} style={{ marginLeft: 4 }}>
                    {tokenPair.tokenB}
                  </Typography.Title>
                </Flex>
                <Flex>
                  <Typography.Title level={5}>3.261</Typography.Title>
                  <Typography.Text
                    style={{ marginLeft: 4 }}
                    className="percent-lbl token"
                  >
                    51%
                  </Typography.Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Flex justify="space-between">
              <Typography.Text>Unclaimed fees</Typography.Text>
              <Button type="primary" size="small" className="collect-fee__btn">
                Collect fees
              </Button>
            </Flex>
            <Typography.Title level={2} className="fee-lbl">
              $0.00
            </Typography.Title>
            <Flex flexDirection="col" className="liquidity-info__wrapper">
              <Flex justify="space-between">
                <Flex>
                  <TokenIcon width={16} name={tokenPair.tokenA} />
                  <Typography.Title level={5} style={{ marginLeft: 4 }}>
                    {tokenPair.tokenA}
                  </Typography.Title>
                </Flex>
                <Flex>
                  <Typography.Title level={5}>{'<0.00001'}</Typography.Title>
                </Flex>
              </Flex>
              <Flex justify="space-between" style={{ marginTop: 16 }}>
                <Flex>
                  <TokenIcon width={16} name={tokenPair.tokenB} />
                  <Typography.Title level={5} style={{ marginLeft: 4 }}>
                    {tokenPair.tokenB}
                  </Typography.Title>
                </Flex>
                <Flex>
                  <Typography.Title level={5}>3.261</Typography.Title>
                </Flex>
              </Flex>
            </Flex>
          </Flex> */}

          <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Typography.Text>Current price</Typography.Text>
            <Flex style={{ marginTop: 10 }}>
              <Flex.Item flex={1}>
                <PriceView
                  className="price__wrapper first"
                  price={3029.72}
                  desc={`${tokenPair.tokenB} per ${tokenPair.tokenA}`}
                />
              </Flex.Item>
              <Flex.Item flex={1}>
                <PriceView
                  className="price__wrapper second"
                  price={0.0001}
                  desc={`${tokenPair.tokenA} per ${tokenPair.tokenB}`}
                />
              </Flex.Item>
            </Flex>

            <Flex style={{ marginTop: 16 }}>
              <Flex.Item flex={1}>
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
              </Flex.Item>
              <Flex.Item flex={1}>
                <Box padding={0} className="liquidity-btn__wrapper second">
                  <Button type="default" size="large" style={{ width: '100%' }}>
                    Remove liquidity
                  </Button>
                </Box>
              </Flex.Item>
            </Flex>
          </Flex>
        </>
      )}
    </FormPageWrapper>
  );
};
