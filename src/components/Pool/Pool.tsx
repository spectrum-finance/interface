import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Grid, Loading, Text } from '@geist-ui/react';
import { AssetAmount, AssetInfo } from 'ergo-dex-sdk/build/module/ergo';
import { WalletContext, useSettings } from '../../context';
import { ERG_DECIMALS } from '../../constants/erg';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { isEmpty, isNil } from 'ramda';
import { Select, SelectOptionShape, AmountInput } from '../../core-components';
import { PoolSummary } from './PoolSummary';
import { truncate } from '../../utils/string';
import { getButtonState } from './buttonState';
import { PoolFeeDecimals } from '../../constants/settings';

const getAssetTitle = (asset?: AssetInfo) => {
  if (!asset) return '';
  return asset.name ?? truncate(asset.id);
};

export const Pool = (): JSX.Element => {
  const [{ minerFee }] = useSettings();
  const { isWalletConnected, ergBalance } = useContext(WalletContext);
  const [selectedAssetX, setSelectedAssetX] = useState<
    AssetAmount | undefined
  >();
  const [selectedAssetY, setSelectedAssetY] = useState<
    AssetAmount | undefined
  >();
  const [availableWalletAssets, setAvailableWalletAssets] = useState<
    AssetAmount[] | undefined
  >();
  const [poolFee, setPoolFee] = useState<bigint | undefined>();

  useEffect(() => {
    if (!isWalletConnected) return;
    import('../../services/userWallet').then(({ listWalletAssets }) => {
      listWalletAssets().then(setAvailableWalletAssets);
    });
  }, [isWalletConnected]);

  const assetOptionsX: SelectOptionShape[] =
    availableWalletAssets?.map(({ asset }) => ({
      key: asset.id,
      content: getAssetTitle(asset),
    })) ?? [];
  const assetOptionsY =
    assetOptionsX.filter(({ key }) => key !== selectedAssetX?.asset.id) ?? [];

  const totalFee = renderFractions(
    2n * parseUserInputToFractions(minerFee, ERG_DECIMALS),
    ERG_DECIMALS,
  );

  const handleAssetXChange = useCallback(
    ({ selected }) => {
      const assetAmount = availableWalletAssets?.find(
        ({ asset }) => asset.id === selected.key,
      );
      setSelectedAssetX(assetAmount);
      if (assetAmount && assetAmount.asset.id == selectedAssetY?.asset.id) {
        setSelectedAssetY(undefined);
      }
    },
    [availableWalletAssets, selectedAssetY],
  );

  const handleAssetYChange = useCallback(
    ({ selected }) => {
      const asset = availableWalletAssets?.find(
        ({ asset }) => asset.id === selected.key,
      );
      setSelectedAssetY(asset);
    },
    [availableWalletAssets],
  );
  const buttonState = getButtonState({
    selectedAssetX,
    selectedAssetY,
    poolFee: !isNil(poolFee)
      ? Number(renderFractions(poolFee, PoolFeeDecimals))
      : undefined,
    ergBalance,
    totalFee: Number(totalFee),
  });

  if (!isWalletConnected) {
    return (
      <Card>
        <Text h6>Wallet not connected</Text>
      </Card>
    );
  }

  if (availableWalletAssets === undefined) {
    return (
      <Card>
        <Loading>Fetching available tokens</Loading>
      </Card>
    );
  }

  if (isEmpty(availableWalletAssets)) {
    return (
      <Card>
        <Loading>No tokens available to create pool</Loading>
      </Card>
    );
  }

  const isFormDisabled = buttonState.isDisabled;
  return (
    <>
      <Card>
        <form>
          <Grid.Container gap={1}>
            <Grid xs={24}>
              <Text h5>Pool</Text>
            </Grid>
            <Grid xs={24}>
              <Select
                name="selectedAssetX"
                placeholder="Select first token"
                options={assetOptionsX}
                selected={selectedAssetX?.asset.id ?? null}
                onChange={handleAssetXChange}
              />
            </Grid>
            <Grid xs={24}>
              <Select
                name="selectedAssetY"
                placeholder="Select second token"
                options={assetOptionsY}
                selected={selectedAssetY?.asset.id ?? null}
                onChange={handleAssetYChange}
              />
            </Grid>
            <Grid xs={24}>
              <Text h5>Transaction fee</Text>
            </Grid>
            <Grid xs={24}>
              <AmountInput
                suffix=""
                onChange={(_, { value }) => {
                  setPoolFee(isNil(value) ? undefined : BigInt(value));
                }}
                value={isNil(poolFee) ? undefined : Number(poolFee)}
                minority={1000}
              />
            </Grid>
            {!isFormDisabled && (
              <Grid xs={24} alignItems="flex-start" direction="column">
                <Text h5>Pool summary</Text>
                <PoolSummary totalFee={totalFee} />
              </Grid>
            )}
            <Grid xs={24} justify="center">
              <Button htmlType="submit" disabled={isFormDisabled}>
                {buttonState.text}
              </Button>
            </Grid>
          </Grid.Container>
        </form>
      </Card>
    </>
  );
};
