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
import { AmmPool, T2tPoolOps } from 'ergo-dex-sdk';
import { YoroiProver } from '../../utils/yoroiProver';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
  ErgoBox, ergoTxToProxy,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext } from '../../context/WalletContext';
import { getButtonState, WalletStates } from './utils';
import { NanoErgInErg } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';
import { explorer } from '../../utils/explorer';
import { useCheckPool } from '../../hooks/useCheckPool';
import { validateInputAmount } from '../Swap/validation';
import { calculateAvailableAmount } from '../../utils/walletMath';
import { ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';

export const Deposit = (): JSX.Element => {
  const [{ minerFee, address: choosedAddress }] = useSettings();
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
    console.log('sp: ', selectedPool);
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

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      selectedPool,
      inputAmount: inputAmountX,
      outputAmount: inputAmountY,
    });
    switch (buttonState) {
      case WalletStates.NEED_TO_SELECT_POOL: {
        return { disabled: true, text: 'Wallet not selected' };
      }
      case WalletStates.SUBMIT: {
        return { disabled: false, text: 'Submit' };
      }
      case WalletStates.NEED_TO_CONNECT_WALLET: {
        return { disabled: true, text: 'Need to connect wallet' };
      }
      case WalletStates.NEED_TO_ENTER_AMOUNT: {
        return { disabled: true, text: 'Need to enter amount' };
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
            BigInt(
              evaluate(
                `${value}*10^${inputAssetAmountX.asset.decimals || 0}`,
              ).toFixed(0),
            ),
          ),
        );

        setInputAmountY(
          String(
            evaluate(
              `${amount?.amount}/10^${inputAssetAmountY.asset.decimals || 0}`,
            ),
          ),
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
            BigInt(
              evaluate(
                `${value}*10^${inputAssetAmountY.asset.decimals || 0}`,
              ).toFixed(0),
            ),
          ),
        );

        setInputAmountX(
          String(
            evaluate(
              `${amount?.amount}/10^${inputAssetAmountX.asset.decimals || 0}`,
            ),
          ),
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
      choosedAddress
    ) {
      const network = explorer;
      const poolId = selectedPool.id;

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(choosedAddress) as string;
      poolOps
        .deposit(
          {
            pk,
            poolId,
            dexFee: BigInt(evaluate(`${dexFee} * ${NanoErgInErg}`)),
            x: selectedPool.assetX,
            y: selectedPool.assetY,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(`(${minerFee}+${dexFee})*${NanoErgInErg}`),
              assets: [
                {
                  tokenId: inputAssetAmountX.asset.id,
                  amount: evaluate(
                    `${inputAmountX}*10^${
                      inputAssetAmountX.asset.decimals || 0
                    }`,
                  ).toFixed(0),
                },
                {
                  tokenId: inputAssetAmountY.asset.id,
                  amount: evaluate(
                    `${inputAmountY}*10^${
                      inputAssetAmountY.asset.decimals || 0
                    }`,
                  ).toFixed(0),
                },
              ],
            }) as BoxSelection,
            changeAddress: choosedAddress,
            selfAddress: choosedAddress,
            feeNErgs: BigInt(Number(minerFee) * NanoErgInErg),
            network: await network.getNetworkContext(),
          },
        )
        .then(async (tx) => {
          await ergo.submit_tx(ergoTxToProxy(tx));
          toast.success(`Transaction submitted: ${tx} `);
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
                          return validateInputAmount(value, {
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
                          return validateInputAmount(value, {
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
                          buttonStatus.disabled ||
                          Object.values(errors).length > 0
                        }
                      >
                        {buttonStatus.text}
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
