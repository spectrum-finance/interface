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

  return (
    <FormPageWrapper title="Position overview" width={480} withBackButton>
      {position && (
        <>
          <Flex alignItems="center">
            <TokenIconPair tokenPair={tokenPair} />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${tokenPair.tokenA} / ${tokenPair.tokenB}`}
            </Typography.Title>
            <Flex.Item marginLeft={2}>
              <Box padding={[0.5, 1]} contrast>
                <Typography.Text style={{ fontSize: '12px' }}>
                  {getPoolFee(position.feeNum)}%
                </Typography.Text>
              </Box>
            </Flex.Item>
          </Flex>

          <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Typography.Text>Liquidity</Typography.Text>
            {/* <Typography.Title level={2} style={{ marginTop: 8 }}>
              $6.50
            </Typography.Title> */}
            <Flex.Item marginTop={2}>
              <Box padding={3} className="liquidity-info__wrapper">
                <Flex flexDirection="col">
                  <Flex justify="space-between">
                    <Flex>
                      <TokenIcon width={16} name={tokenPair.tokenA} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenA}
                      </Typography.Title>
                    </Flex>
                    <Flex>
                      <Typography.Title level={5}>0.0009999</Typography.Title>
                      <Flex.Item marginLeft={1}>
                        <Box padding={[0.5, 1]} className="percent-lbl">
                          <Typography.Text style={{ fontSize: '12px' }}>
                            49%
                          </Typography.Text>
                        </Box>
                      </Flex.Item>
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
                      <Flex.Item marginLeft={1}>
                        <Box padding={[0.5, 1]} className="percent-lbl">
                          <Typography.Text style={{ fontSize: '12px' }}>
                            51%
                          </Typography.Text>
                        </Box>
                      </Flex.Item>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Flex.Item>
          </Flex>

          {/* <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Flex justify="space-between">
              <Typography.Text>Unclaimed fees</Typography.Text>
              <Button type="primary" size="small">
                Collect fees
              </Button>
            </Flex>
            <Flex.Item marginTop={2}>
              <Typography.Title level={2} className="fee-lbl">
                $0.00
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginTop={2}>
              <Box padding={3} className="liquidity-info__wrapper">
                <Flex flexDirection="col">
                  <Flex justify="space-between">
                    <Flex>
                      <TokenIcon width={16} name={tokenPair.tokenA} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {tokenPair.tokenA}
                      </Typography.Title>
                    </Flex>
                    <Flex>
                      <Typography.Title level={5}>
                        {'<0.00001'}
                      </Typography.Title>
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
              </Box>
            </Flex.Item>
          </Flex> */}

          <Flex flexDirection="col" style={{ marginTop: 16 }}>
            <Typography.Text>Current price</Typography.Text>
            <Flex style={{ marginTop: 10 }}>
              <Flex.Item flex={1} marginRight={1}>
                <PriceView
                  className="price__wrapper"
                  price={3029.72}
                  desc={`${tokenPair.tokenB} per ${tokenPair.tokenA}`}
                />
              </Flex.Item>
              <Flex.Item flex={1} marginLeft={1}>
                <PriceView
                  className="price__wrapper"
                  price={0.0001}
                  desc={`${tokenPair.tokenA} per ${tokenPair.tokenB}`}
                />
              </Flex.Item>
            </Flex>

            <Flex style={{ marginTop: 16 }}>
              <Flex.Item flex={1} marginRight={1}>
                <Box padding={0}>
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
              <Flex.Item flex={1} marginLeft={1}>
                <Box padding={0}>
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
