import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Grid, Loading, Text } from '@geist-ui/react';
import {
  AssetAmount,
  AssetInfo,
  BoxSelection,
  DefaultBoxSelector,
  ergoTxToProxy,
} from 'ergo-dex-sdk/build/module/ergo';
import {
  makePoolSetupParams,
  PoolSetupParams,
} from 'ergo-dex-sdk/build/module/amm/models/poolSetupParams';
import { WalletContext, useSettings } from '../../context';
import { ERG_DECIMALS } from '../../constants/erg';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { isEmpty, isNil } from 'ramda';
import { Select, SelectOptionShape, AmountInput } from '../../core-components';
import { CreatePoolSummary } from './CreatePoolSummary';
import { poolActions } from '../../services/poolOptions';
import explorer from '../../services/explorer';
import { truncate } from '../../utils/string';
import { getButtonState } from './buttonState';
import { PoolFeeDecimals } from '../../constants/settings';
import { calculateAvailableAmount } from '../../utils/walletMath';
import { miniSufficientValue } from '../../utils/ammMath';
import { toast } from 'react-toastify';

const getAssetTitle = (asset?: AssetInfo) => {
  if (!asset) return '';
  return asset.name ?? truncate(asset.id);
};

export const CreatePool = (): JSX.Element => {
  const [{ minerFee, address: addressFromSettings }] = useSettings();
  const { isWalletConnected, ergBalance, utxos } = useContext(WalletContext);
  const [selectedAssetX, setSelectedAssetX] = useState<
    AssetAmount | undefined
  >();
  const [selectedAssetY, setSelectedAssetY] = useState<
    AssetAmount | undefined
  >();
  const [availableWalletAssets, setAvailableWalletAssets] = useState<
    AssetAmount[] | undefined
  >();
  const [assetAmountX, setAssetAmountX] = useState<bigint | undefined>();
  const [assetAmountY, setAssetAmountY] = useState<bigint | undefined>();
  const [availableInputAmountX, setAvailableInputAmountX] = useState(0n);
  const [availableInputAmountY, setAvailableInputAmountY] = useState(0n);
  const [poolFee, setPoolFee] = useState<bigint | undefined>();

  useEffect(() => {
    if (!isWalletConnected) return;
    import('../../services/userWallet').then(({ listWalletAssets }) => {
      listWalletAssets().then(setAvailableWalletAssets);
    });
  }, [isWalletConnected]);

  useEffect(() => {
    if (isWalletConnected && selectedAssetX && selectedAssetY) {
      if (utxos) {
        setAvailableInputAmountX(
          calculateAvailableAmount(selectedAssetX.asset.id, utxos),
        );
        setAvailableInputAmountY(
          calculateAvailableAmount(selectedAssetY.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, selectedAssetX, selectedAssetY, utxos]);

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

  const handleAssetAmountX = useCallback((_, { value }) => {
    const cleanValue = isNil(value) ? undefined : BigInt(value);
    setAssetAmountX(cleanValue);
  }, []);

  const handleAssetAmountY = useCallback((_, { value }) => {
    const cleanValue = isNil(value) ? undefined : BigInt(value);
    setAssetAmountY(cleanValue);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (
        !selectedAssetX ||
        !assetAmountX ||
        !selectedAssetY ||
        !assetAmountY ||
        !poolFee ||
        !utxos ||
        !addressFromSettings
      ) {
        return;
      }
      const poolParams = makePoolSetupParams(
        new AssetAmount(selectedAssetX?.asset, assetAmountX),
        new AssetAmount(selectedAssetY?.asset, assetAmountY),
        Number(renderFractions(poolFee, PoolFeeDecimals)),
      );

      const isPoolValidPoolSetupParams = (
        x: ReturnType<typeof makePoolSetupParams>,
      ): x is PoolSetupParams => {
        return !Array.isArray(x);
      };

      if (!isPoolValidPoolSetupParams(poolParams)) {
        console.error(poolParams);
        poolParams.forEach((error) => toast.error(error.error));
        return;
      }

      const actions = poolActions(poolParams);

      actions
        .setup(poolParams as PoolSetupParams, {
          inputs: DefaultBoxSelector.select(utxos, {
            nErgs: miniSufficientValue(
              parseUserInputToFractions(minerFee, ERG_DECIMALS),
              0n,
            ),
            assets: [
              {
                tokenId: selectedAssetX.asset.id,
                amount: assetAmountX,
              },
              {
                tokenId: selectedAssetY.asset.id,
                amount: assetAmountY,
              },
            ],
          }) as BoxSelection,
          changeAddress: addressFromSettings,
          selfAddress: addressFromSettings,
          feeNErgs: parseUserInputToFractions(String(minerFee), ERG_DECIMALS),
          network: await explorer.getNetworkContext(),
        })
        .then(async (txs) => {
          const promises = txs.map((tx) => ergo.submit_tx(ergoTxToProxy(tx)));
          Promise.all(promises).then((submittedTxs) => {
            submittedTxs.forEach((txId) => {
              toast.success(`Transaction submitted: ${txId} `);
            });
          });
        })
        .catch((er) => toast.error(JSON.stringify(er)));
    },
    [
      selectedAssetX,
      assetAmountX,
      selectedAssetY,
      assetAmountY,
      poolFee,
      utxos,
      addressFromSettings,
      minerFee,
    ],
  );

  const buttonState = getButtonState({
    selectedAssetX,
    selectedAssetY,
    assetAmountX,
    assetAmountY,
    availableInputAmountX,
    availableInputAmountY,
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
        <form onSubmit={handleSubmit}>
          <Grid.Container gap={1}>
            <Grid xs={24}>
              <Text h2>Create pool</Text>
            </Grid>
            <Grid xs={24}>
              <Text h5>First token</Text>
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
              <Text h5>First token amount</Text>
            </Grid>
            <Grid xs={24}>
              <AmountInput
                suffix=""
                onChange={handleAssetAmountX}
                value={isNil(assetAmountX) ? undefined : Number(assetAmountX)}
                disabled={isNil(selectedAssetX)}
                minority={Math.pow(10, selectedAssetX?.asset.decimals ?? 0)}
              />
            </Grid>
            <Grid xs={24}>
              <Text h5>Second token</Text>
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
              <Text h5>Second token amount</Text>
            </Grid>
            <Grid xs={24}>
              <AmountInput
                suffix=""
                onChange={handleAssetAmountY}
                value={isNil(assetAmountY) ? undefined : Number(assetAmountY)}
                disabled={isNil(selectedAssetY)}
                minority={Math.pow(10, selectedAssetY?.asset.decimals ?? 0)}
              />
            </Grid>
            <Grid xs={24}>
              <Text h5>Pool fee</Text>
            </Grid>
            <Grid xs={24}>
              <AmountInput
                suffix=""
                onChange={(_, { value }) => {
                  setPoolFee(isNil(value) ? undefined : BigInt(value));
                }}
                value={isNil(poolFee) ? undefined : Number(poolFee)}
                minority={Math.pow(10, PoolFeeDecimals)}
              />
            </Grid>
            {!isFormDisabled && (
              <Grid xs={24} alignItems="flex-start" direction="column">
                <Text h5>Pool summary</Text>
                <CreatePoolSummary totalFee={totalFee} />
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
