import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Card,
  Grid,
  Input,
  Loading,
  Spacer,
  Text,
  Note,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { evaluate } from 'mathjs';
import { AmmPool } from 'ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  ErgoBox,
  ergoTxToProxy,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext, useSettings } from '../../context';
import { getAppState, AppState } from './utils';
import { ERG_DECIMALS } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { toast } from 'react-toastify';
import explorer from '../../services/explorer';
import poolOptions from '../../services/poolOptions';
import { useCheckPool } from '../../hooks/useCheckPool';
import { validateInputAmount } from '../Swap/validation';
import { calculateAvailableAmount } from '../../utils/walletMath';
import { ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';

export const Deposit = (): JSX.Element => {
  const [{ minerFee, address: chosenAddress }] = useSettings();
  const { isWalletConnected } = useContext(WalletContext);
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
  const [dexFee] = useState<number>(0.01);
  const [inputAssetAmountX, setInputAssetAmountX] = useState<
    AssetAmount | undefined
  >();
  const [inputAssetAmountY, setInputAssetAmountY] = useState<
    AssetAmount | undefined
  >();
  const [availableInputAmountX, setAvailableInputAmountX] = useState(0n);
  const [availableInputAmountY, setAvailableInputAmountY] = useState(0n);
  const [inputAmountX, setInputAmountX] = useState('');
  const [inputAmountY, setInputAmountY] = useState('');
  const isPoolValid = useCheckPool(selectedPool);

  const [utxos, setUtxos] = useState<ErgoBox[]>([]);
  const availablePools = useGetAllPools();

  useEffect(() => {
    if (isWalletConnected && inputAssetAmountX) {
      if (utxos) {
        setAvailableInputAmountX(
          calculateAvailableAmount(inputAssetAmountX.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, inputAssetAmountX, utxos]);

  useEffect(() => {
    if (isWalletConnected && inputAssetAmountY) {
      if (utxos) {
        setAvailableInputAmountY(
          calculateAvailableAmount(inputAssetAmountY.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, inputAssetAmountX, utxos, inputAssetAmountY]);

  const lpTokens = useMemo(() => {
    if (
      selectedPool &&
      inputAmountX &&
      inputAssetAmountX &&
      inputAmountY &&
      inputAssetAmountY
    ) {
      return selectedPool.rewardLP(
        new AssetAmount(
          inputAssetAmountX.asset,
          BigInt(
            evaluate(
              `${inputAmountX}*10^${inputAssetAmountX.asset.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
        new AssetAmount(
          inputAssetAmountY.asset,
          BigInt(
            evaluate(
              `${inputAmountY}*10^${inputAssetAmountY.asset.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
      ).amount;
    }

    return '';
  }, [
    selectedPool,
    inputAmountX,
    inputAssetAmountX,
    inputAmountY,
    inputAssetAmountY,
  ]);

  const updateSelectedPool = useCallback((pool: AmmPool) => {
    setSelectedPool(pool);
    setInputAssetAmountX(pool.x);
    setInputAssetAmountY(pool.y);
  }, []);

  useEffect(() => {
    if (
      selectedPool &&
      (selectedPool.x.asset.id !== inputAssetAmountX?.asset.id ||
        selectedPool.y.asset.id !== inputAssetAmountY?.asset.id)
    ) {
      setInputAssetAmountX(selectedPool.x);
      setInputAssetAmountY(selectedPool.y);
    }
    if (!selectedPool && availablePools) {
      updateSelectedPool(availablePools[0]);
    }
  }, [
    availablePools,
    updateSelectedPool,
    selectedPool,
    inputAssetAmountX?.asset.id,
    inputAssetAmountY?.asset.id,
  ]);

  const buttonState = useMemo(() => {
    const appState = getAppState({
      isWalletConnected,
      selectedPool,
      inputAmount: inputAmountX,
      outputAmount: inputAmountY,
    });
    switch (appState) {
      case AppState.POOL_NOT_SELECTED: {
        return { disabled: true, text: 'Pool not selected' };
      }
      case AppState.SUBMIT: {
        return { disabled: false, text: 'Submit' };
      }
      case AppState.WALLET_NOT_CONNECTED: {
        return { disabled: true, text: 'Wallet not connected' };
      }
      case AppState.AMOUNT_NOT_SPECIFIED: {
        return { disabled: true, text: 'Amount not specified' };
      }
    }
  }, [isWalletConnected, inputAmountX, inputAmountY, selectedPool]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo
        .get_utxos()
        .then((bs) => (bs ? bs.map((b) => ergoBoxFromProxy(b)) : bs))
        .then((data) => setUtxos(data ?? []));
    }
  }, [isWalletConnected]);

  const onEnterTokenAmount = (value: string, token: 'input' | 'output') => {
    if (!selectedPool || !inputAssetAmountX || !inputAssetAmountY) {
      return;
    }

    if (token === 'input') {
      setInputAmountX(value);

      if (Number(value) > 0) {
        const amount = selectedPool.depositAmount(
          new AssetAmount(
            inputAssetAmountX.asset,
            parseUserInputToFractions(value, inputAssetAmountX.asset.decimals),
          ),
        );

        setInputAmountY(
          renderFractions(amount?.amount, inputAssetAmountY.asset.decimals),
        );
      }

      if (!value.trim()) {
        setInputAmountY('');
      }
    }

    if (token === 'output') {
      setInputAmountY(value);

      if (Number(value) > 0) {
        const amount = selectedPool.depositAmount(
          new AssetAmount(
            inputAssetAmountY.asset,
            parseUserInputToFractions(value, inputAssetAmountY.asset.decimals),
          ),
        );

        setInputAmountX(
          renderFractions(amount?.amount, inputAssetAmountX.asset.decimals),
        );
      }

      if (!value.trim()) {
        setInputAmountX('');
      }
    }
  };

  const onSubmit = async () => {
    if (
      isWalletConnected &&
      selectedPool &&
      inputAssetAmountX &&
      inputAssetAmountY &&
      chosenAddress
    ) {
      const network = explorer;
      const poolId = selectedPool.id;

      const pk = fromAddress(chosenAddress) as string;

      poolOptions
        .deposit(
          {
            pk,
            poolId,
            dexFee: parseUserInputToFractions(String(dexFee), ERG_DECIMALS),
            x: selectedPool.assetX,
            y: selectedPool.assetY,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: parseUserInputToFractions(
                `${Number(minerFee) + Number(dexFee)}`,
                ERG_DECIMALS,
              ),
              assets: [
                {
                  tokenId: inputAssetAmountX.asset.id,
                  amount: parseUserInputToFractions(
                    inputAmountX,
                    inputAssetAmountX.asset.decimals,
                  ),
                },
                {
                  tokenId: inputAssetAmountY.asset.id,
                  amount: parseUserInputToFractions(
                    inputAmountY,
                    inputAssetAmountY.asset.decimals,
                  ),
                },
              ],
            }) as BoxSelection,
            changeAddress: chosenAddress,
            selfAddress: chosenAddress,
            feeNErgs: parseUserInputToFractions(String(minerFee), ERG_DECIMALS),
            network: await network.getNetworkContext(),
          },
        )
        .then(async (tx) => {
          await ergo.submit_tx(ergoTxToProxy(tx));
          toast.success(`Transaction submitted: ${tx.id} `);
        })
        .catch((er) => toast.error(JSON.stringify(er)));
    }
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <Text h6>Wallet not connected</Text>
      </Card>
    );
  }

  if (!availablePools) {
    return (
      <Card>
        <Loading>Fetching available pools..</Loading>
      </Card>
    );
  }

  if (availablePools?.length === 0) {
    return (
      <Card>
        <Loading>No pools available to redeem from</Loading>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            amount: '0',
            address: '',
            dexFee,
          }}
          render={({ handleSubmit, errors = {} }) => (
            <form onSubmit={handleSubmit}>
              <Grid.Container gap={1}>
                <Grid xs={24}>
                  <Text h5>Pool</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="pool" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <PoolSelect
                        pools={availablePools}
                        value={selectedPool}
                        onChangeValue={setSelectedPool}
                        inputProps={props.input}
                      />
                    )}
                  </Field>
                </Grid>
                {isPoolValid.isFetching && (
                  <Grid xs={24}>
                    <Spacer y={2} />
                    <Loading>Validating selected pool...</Loading>
                  </Grid>
                )}
                {!isPoolValid.isFetching && !isPoolValid.result && (
                  <Grid xs={24}>
                    <Note type="error" label="error" filled>
                      This pool is invalid. Please select another one.
                    </Note>
                  </Grid>
                )}

                {!isPoolValid.isFetching && isPoolValid.result && (
                  <>
                    <Grid xs={24}>
                      <Text h5>Deposit amounts</Text>
                    </Grid>
                    <Grid xs={24}>
                      <Field
                        name="inputAmountX"
                        validate={(value) => {
                          return validateInputAmount(value, isWalletConnected, {
                            maxDecimals: inputAssetAmountX?.asset.decimals || 0,
                            maxAvailable: availableInputAmountX,
                          });
                        }}
                      >
                        {(props: FieldRenderProps<string>) => (
                          <>
                            <Input
                              placeholder="0.0"
                              type="number"
                              width="100%"
                              lang="en"
                              label={inputAssetAmountX?.asset.name ?? ''}
                              {...props.input}
                              disabled={!inputAssetAmountX}
                              value={inputAmountX}
                              onChange={({ currentTarget }) => {
                                const value = currentTarget.value;
                                onEnterTokenAmount(value, 'input');
                                props.input.onChange(value);
                              }}
                            />
                            {props.meta.error && <p>{props.meta.error}</p>}
                          </>
                        )}
                      </Field>
                    </Grid>
                    <Grid xs={24}>
                      <Field
                        name="outputAmount"
                        validate={(value) => {
                          return validateInputAmount(value, isWalletConnected, {
                            maxDecimals: inputAssetAmountY?.asset.decimals || 0,
                            maxAvailable: availableInputAmountY,
                          });
                        }}
                      >
                        {(props: FieldRenderProps<string>) => (
                          <Input
                            placeholder="0.0"
                            type="number"
                            label={inputAssetAmountY?.asset.name ?? ''}
                            width="100%"
                            {...props.input}
                            value={inputAmountY}
                            onChange={({ currentTarget }) => {
                              const value = currentTarget.value;
                              onEnterTokenAmount(value, 'output');
                              props.input.onChange(value);
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    {selectedPool && (
                      <Grid xs={24}>
                        <Card>
                          <div>lp = {Number(lpTokens)}</div>
                        </Card>
                      </Grid>
                    )}
                    <Grid xs={24} justify="center">
                      <Button
                        htmlType="submit"
                        disabled={
                          buttonState.disabled ||
                          Object.values(errors).length > 0
                        }
                      >
                        {buttonState.text}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid.Container>
            </form>
          )}
        />
      </Card>
    </>
  );
};
