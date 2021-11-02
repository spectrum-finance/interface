// TODO: REPLACE_ANTD_SKELETON_COMPONENT[EDEX-467]
import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { Skeleton } from 'antd';
import { evaluate } from 'mathjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TokenIconPair } from '../../components/TokenIconPair/TokenIconPair';
import {
  Button,
  Flex,
  Modal,
  SettingOutlined,
  Typography,
} from '../../ergodex-cdk';
import { usePosition } from '../../hooks/usePosition';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { ConfirmRemoveModal } from './ConfirmRemoveModal/ConfirmRemoveModal';
import { PairSpace } from './PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from './RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';
import { RemovePositionSlider } from './RemovePositionSlider/RemovePositionSlider';
import { RemovableAssetPair } from './types';

const getPercent = (val: string, percent: string): string =>
  evaluate(`${val} * ${percent}%`);

const Remove = (): JSX.Element => {
  const { poolId } = useParams<{ poolId: PoolId }>();

  const DEFAULT_SLIDER_PERCENTAGE = '100';
  const [percent, setPercent] = useState(DEFAULT_SLIDER_PERCENTAGE);
  const [initialPair, setInitialPair] = useState<RemovableAssetPair>();
  const [pair, setPair] = useState<RemovableAssetPair>();

  const [lpBalance, setLpBalance] = useState<string | undefined>();

  const position = usePosition(poolId);

  useEffect(() => {
    if (position) {
      ergo.get_balance(position.lp.asset.id).then(setLpBalance);
    }
  }, [position]);

  useEffect(() => {
    if (position && position.x && position.y && lpBalance) {
      const sharedPair = position.shares(
        new AssetAmount(
          position.lp.asset,
          parseUserInputToFractions(lpBalance),
        ),
      );

      const positionPair = {
        assetX: {
          name: sharedPair[0].asset.name || '',
          amount: renderFractions(
            sharedPair[0].amount,
            sharedPair[0].asset.decimals,
          ),
          earnedFees: '',
        },
        assetY: {
          name: sharedPair[1].asset.name || '',
          amount: renderFractions(
            sharedPair[1].amount,
            sharedPair[1].asset.decimals,
          ),
          earnedFees: '',
        },
      };

      setPair(positionPair);
      setInitialPair(positionPair);
    }
  }, [position, lpBalance]);

  const handleChangePercent = useCallback(
    (percentage) => {
      setPercent(percentage);

      if (position && pair && initialPair) {
        setPair(() => {
          const { assetX, assetY } = pair;

          return {
            assetX: {
              name: assetX.name,
              amount: getPercent(initialPair.assetX.amount, percentage),
              earnedFees: assetX.earnedFees,
            },
            assetY: {
              name: assetY.name,
              amount: getPercent(initialPair.assetY.amount, percentage),
              earnedFees: assetY.earnedFees,
            },
          };
        });
      }
    },
    [position, pair, initialPair],
  );

  const handleRemove = () => {
    Modal.open(
      ({ close }) => {
        if (position && lpBalance && pair) {
          return (
            <ConfirmRemoveModal
              onClose={close}
              pair={pair}
              position={position}
              lpToRemove={position.lp.withAmount(
                BigInt(Number(getPercent(lpBalance, percent)).toFixed(0)),
              )}
            />
          );
        }
      },
      {
        title: 'Remove liquidity',
        width: 436,
      },
    );
  };

  return (
    <FormPageWrapper width={382}>
      {pair ? (
        <Flex flexDirection="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item>
                <Flex alignItems="center">
                  <Flex.Item display="flex" marginRight={2}>
                    <TokenIconPair
                      tokenPair={{
                        tokenA: pair.assetX.name,
                        tokenB: pair.assetY.name,
                      }}
                    />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Title level={4}>
                      {pair.assetX.name} / {pair.assetY.name}
                    </Typography.Title>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Button size="large" type="text" icon={<SettingOutlined />} />
              </Flex.Item>
            </Flex>
          </Flex.Item>

          <Flex.Item marginBottom={4}>
            <RemoveFormSpaceWrapper title="Amount">
              <RemovePositionSlider
                percent={percent}
                onChange={handleChangePercent}
              />
            </RemoveFormSpaceWrapper>
          </Flex.Item>

          <Flex.Item marginBottom={4}>
            <PairSpace title="Pooled Assets" pair={pair} />
          </Flex.Item>

          {/*TODO: ADD_FEES_DISPLAY_AFTER_SDK_UPDATE[EDEX-468]*/}
          {/*<Flex.Item marginBottom={4}>*/}
          {/*  <TokenSpace title="Earned Fees" pair={pair} fees />*/}
          {/*</Flex.Item>*/}
          <Flex.Item>
            <SubmitButton onClick={handleRemove}>Remove</SubmitButton>
          </Flex.Item>
        </Flex>
      ) : (
        <Skeleton active />
      )}
    </FormPageWrapper>
  );
};

export { Remove };
