// TODO: REPLACE_ANTD_SKELETON_COMPONENT[EDEX-467]
import { PoolId } from '@ergolabs/ergo-dex-sdk';
import { evaluate } from 'mathjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { AssetPair } from '../../@types/asset';
import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import {
  openConfirmationModal,
  Operation,
} from '../../components/ConfirmationModal/ConfirmationModal';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TokenIconPair } from '../../components/TokenIconPair/TokenIconPair';
import { Flex, Skeleton, Typography } from '../../ergodex-cdk';
import { usePair } from '../../hooks/usePair';
import { usePosition } from '../../hooks/usePosition';
import { parseUserInputToFractions } from '../../utils/math';
import { ConfirmRemoveModal } from './ConfirmRemoveModal/ConfirmRemoveModal';
import { PairSpace } from './PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from './RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';
import { RemovePositionSlider } from './RemovePositionSlider/RemovePositionSlider';

const getPercent = (val: number | undefined, percent: string): number =>
  Number(evaluate(`${val} * ${percent}%`));

export const Remove = (): JSX.Element => {
  const { poolId } = useParams<{ poolId: PoolId }>();

  const DEFAULT_SLIDER_PERCENTAGE = '100';
  const [percent, setPercent] = useState(DEFAULT_SLIDER_PERCENTAGE);
  const [initialPair, setInitialPair] = useState<AssetPair>();
  const [isFirstPairLoading, setIsFirstPairLoading] = useState(true);
  const [lpToRemove, setLpToRemove] = useState<number | undefined>();

  const position = usePosition(poolId);
  const { pair, lpBalance, setPair } = usePair(position);

  useEffect(() => {
    if (isFirstPairLoading && pair && lpBalance) {
      setInitialPair(pair);
      setIsFirstPairLoading(false);
      setLpToRemove(lpBalance);
    }
  }, [isFirstPairLoading, pair, lpBalance]);

  const handleChangePercent = useCallback(
    (percentage) => {
      setPercent(percentage);

      if (position && pair && initialPair && setPair && lpBalance) {
        setLpToRemove(getPercent(lpBalance, percentage));
        setPair({
          assetX: {
            name: pair.assetX.name,
            asset: pair.assetX.asset,
            amount: +getPercent(initialPair.assetX.amount, percentage).toFixed(
              pair.assetX.asset?.decimals,
            ),
            earnedFees: pair.assetX?.earnedFees,
          },
          assetY: {
            name: pair.assetY.name,
            asset: pair.assetY.asset,
            amount: +getPercent(initialPair.assetY.amount, percentage).toFixed(
              pair.assetY.asset?.decimals,
            ),
            earnedFees: pair.assetY?.earnedFees,
          },
        });
      }
    },
    [position, pair, initialPair, setPair, lpBalance],
  );

  const handleRemove = () => {
    if (pair && position && lpToRemove) {
      const xAmount = new Currency(
        pair.assetX.amount?.toString(),
        position.x.asset,
      );
      const yAmount = new Currency(
        pair.assetY.amount?.toString(),
        position.y.asset,
      );

      openConfirmationModal(
        (next) => {
          return (
            <ConfirmRemoveModal
              onClose={next}
              xAmount={xAmount}
              yAmount={yAmount}
              pool={new AmmPool(position)}
              lpToRemove={lpToRemove}
            />
          );
        },
        Operation.REMOVE_LIQUIDITY,
        xAmount,
        yAmount,
      );
    }
  };

  return (
    <>
      <FormPageWrapper width={382} title="Remove liquidity" withBackButton>
        {pair ? (
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <Flex justify="space-between" align="center">
                <Flex.Item>
                  <Flex align="center">
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
              <PairSpace
                title="Pooled Assets"
                xAmount={
                  new Currency(
                    pair.assetX.amount?.toString(),
                    pair.assetX.asset,
                  )
                }
                yAmount={
                  new Currency(
                    pair.assetY.amount?.toString(),
                    pair.assetY.asset,
                  )
                }
              />
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
    </>
  );
};
