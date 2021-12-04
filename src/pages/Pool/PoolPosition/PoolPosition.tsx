import './PoolPosition.less';

import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { TokenIconPair } from '../../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Flex,
  PlusOutlined,
  Skeleton,
  Typography,
} from '../../../ergodex-cdk';
import { useSubject } from '../../../hooks/useObservable';
import { usePair } from '../../../hooks/usePair';
import { usePosition } from '../../../hooks/usePosition';
import { getPoolById } from '../../../services/new/pools';
import { getPoolFee } from '../../../utils/pool';
import { getPoolRatio } from '../../../utils/price';
import { PriceView } from './PriceView';

interface URLParamTypes {
  poolId: PoolId;
}

export const PoolPosition: React.FC = () => {
  const history = useHistory();
  const { poolId } = useParams<URLParamTypes>();
  const [positionRatio, setPositionRatio] = useState<Ratio | undefined>();

  const [position, updatePosition] = useSubject(getPoolById);
  const { pair } = usePair(position);

  useEffect(() => {
    updatePosition(poolId);
  }, [poolId, updatePosition]);

  useEffect(() => {
    if (position) {
      const ratio = getPoolRatio(position);
      setPositionRatio(ratio);
    }
  }, [position]);

  const handleRemovePositionClick = (id: PoolId) => {
    history.push(`/remove/${id}/`);
  };

  const handleAddLiquidity = (id: PoolId) => {
    history.push(`/pool/add/${id}/`);
  };

  return (
    <FormPageWrapper
      title="Position overview"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {position && positionRatio && pair ? (
        <>
          <Flex align="center">
            <TokenIconPair
              size="large"
              tokenPair={{ tokenA: pair.assetX.name, tokenB: pair.assetY.name }}
            />
            <Typography.Title level={3} style={{ marginLeft: 8 }}>
              {`${pair.assetX.name} / ${pair.assetY.name}`}
            </Typography.Title>
            <Flex.Item marginLeft={2}>
              <Box padding={[0.5, 1]} contrast>
                <Typography.Text style={{ fontSize: '12px' }}>
                  {getPoolFee(position.feeNum)}%
                </Typography.Text>
              </Box>
            </Flex.Item>
          </Flex>

          <Flex direction="col" style={{ marginTop: 16 }}>
            <Typography.Text>Liquidity</Typography.Text>
            {/* <Typography.Title level={2} style={{ marginTop: 8 }}>
              $6.50
            </Typography.Title> */}
            <Flex.Item marginTop={2}>
              <Box padding={3} className="liquidity-info__wrapper">
                <Flex direction="col">
                  <Flex justify="space-between">
                    <Flex>
                      <TokenIcon name={pair.assetX.name} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {pair.assetX.name}
                      </Typography.Title>
                    </Flex>
                    <Flex>
                      <Typography.Title level={5}>
                        {pair.assetX.amount}
                      </Typography.Title>
                      {/*<Flex.Item marginLeft={1}>*/}
                      {/*  <Box padding={[0.5, 1]} className="percent-lbl">*/}
                      {/*    <Typography.Text style={{ fontSize: '12px' }}>*/}
                      {/*      49%*/}
                      {/*    </Typography.Text>*/}
                      {/*  </Box>*/}
                      {/*</Flex.Item>*/}
                    </Flex>
                  </Flex>
                  <Flex justify="space-between" style={{ marginTop: 16 }}>
                    <Flex>
                      <TokenIcon name={pair.assetY.name} />
                      <Typography.Title level={5} style={{ marginLeft: 4 }}>
                        {pair.assetY.name}
                      </Typography.Title>
                    </Flex>
                    <Flex>
                      <Typography.Title level={5}>
                        {pair.assetY.amount}
                      </Typography.Title>
                      {/*<Flex.Item marginLeft={1}>*/}
                      {/*  <Box padding={[0.5, 1]} className="percent-lbl">*/}
                      {/*    <Typography.Text style={{ fontSize: '12px' }}>*/}
                      {/*      51%*/}
                      {/*    </Typography.Text>*/}
                      {/*  </Box>*/}
                      {/*</Flex.Item>*/}
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

          <Flex col style={{ marginTop: 16 }}>
            <Typography.Text>Current price</Typography.Text>
            <Flex style={{ marginTop: 10 }} col>
              <Flex.Item flex={1} marginBottom={2}>
                <PriceView
                  className="price__wrapper"
                  price={positionRatio.xPerY}
                  desc={`${pair.assetX.name} per ${pair.assetY.name}`}
                />
              </Flex.Item>
              <Flex.Item flex={1}>
                <PriceView
                  className="price__wrapper"
                  price={positionRatio.yPerX}
                  desc={`${pair.assetY.name} per ${pair.assetX.name}`}
                />
              </Flex.Item>
            </Flex>

            <Flex style={{ marginTop: 16 }}>
              <Flex.Item flex={1} marginRight={1}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddLiquidity(poolId)}
                  block
                >
                  Increase liquidity
                </Button>
              </Flex.Item>
              <Flex.Item flex={1} marginLeft={1}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => handleRemovePositionClick(poolId)}
                >
                  Remove liquidity
                </Button>
              </Flex.Item>
            </Flex>
          </Flex>
        </>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};
