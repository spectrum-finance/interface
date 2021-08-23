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
import { AmmPool } from 'ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  ergoTxToProxy,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext, useSettings } from '../../context';
import { getButtonState } from './buttonState';
import { ERG_DECIMALS } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { toast } from 'react-toastify';
import explorer from '../../services/explorer';
import { poolActions, nativePoolActions } from '../../services/poolOptions';
import { useCheckPool } from '../../hooks/useCheckPool';
import { calculateAvailableAmount } from '../../utils/walletMath';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { DepositSummary } from './DepositSummary';
import { toFloat } from '../../utils/string';
import { miniSufficientValue } from '../../utils/ammMath';
import { calculateTotalFee } from '../../utils/transactions';
import { isNative } from 'ergo-dex-sdk/build/main/ergo/entities/assetInfo';

export const Deposit = (): JSX.Element => {
  const [{ minerFee, address: chosenAddress }] = useSettings();
  const { isWalletConnected, utxos, ergBalance } = useContext(WalletContext);
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

  const availablePools = useGetAllPools();

  const totalFee = calculateTotalFee(minerFee, String(dexFee), {
    precision: ERG_DECIMALS,
  });

  useEffect(() => {
    if (isWalletConnected && inputAssetAmountX && inputAssetAmountY) {
      if (utxos) {
        setAvailableInputAmountX(
          calculateAvailableAmount(inputAssetAmountX.asset.id, utxos),
        );
        setAvailableInputAmountY(
          calculateAvailableAmount(inputAssetAmountY.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, inputAssetAmountX, inputAssetAmountY, utxos]);

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
          parseUserInputToFractions(
            inputAmountX,
            inputAssetAmountX.asset.decimals,
          ),
        ),
        new AssetAmount(
          inputAssetAmountY.asset,
          parseUserInputToFractions(
            inputAmountY,
            inputAssetAmountY.asset.decimals,
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
    setInputAmountX('');
    setInputAmountY('');
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
    return getButtonState({
      isWalletConnected,
      selectedPool,
      inputAmountX,
      inputAmountY,
      availableInputAmountX,
      availableInputAmountY,
      ergBalance,
      minerFee,
      dexFee,
    });
  }, [
    isWalletConnected,
    selectedPool,
    inputAmountX,
    inputAmountY,
    availableInputAmountX,
    availableInputAmountY,
    ergBalance,
    minerFee,
    dexFee,
  ]);

  const handleTokenAmountChange = (
    value: string,
    token: 'input' | 'output',
  ) => {
    if (!selectedPool || !inputAssetAmountX || !inputAssetAmountY) {
      return;
    }
    const cleanValue = toFloat(value);

    if (token === 'input') {
      setInputAmountX(cleanValue);

      if (Number(cleanValue) > 0) {
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
    }

    if (!cleanValue.trim()) {
      setInputAmountY('');
    }

    if (token === 'output') {
      setInputAmountY(cleanValue);

      if (Number(cleanValue) > 0) {
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

      if (!cleanValue.trim()) {
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
      chosenAddress &&
      utxos
    ) {
      const network = explorer;
      const poolId = selectedPool.id;

      const pk = fromAddress(chosenAddress) as string;

      const actions = isNative(selectedPool.x.asset)
        ? nativePoolActions
        : poolActions;

      actions
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
              nErgs: miniSufficientValue(
                parseUserInputToFractions(minerFee, ERG_DECIMALS),
                parseUserInputToFractions(String(dexFee), ERG_DECIMALS),
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
          render={({ handleSubmit, errors = {} }) => {
            const isFormDisabled =
              buttonState.isDisabled || Object.values(errors).length > 0;
            return (
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
                  {!isPoolValid.isFetching && isPoolValid.result === false && (
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
                        <Field name="inputAmountX">
                          {(props: FieldRenderProps<string>) => (
                            <>
                              <Input
                                placeholder="0.0"
                                width="100%"
                                lang="en"
                                label={inputAssetAmountX?.asset.name ?? ''}
                                {...props.input}
                                disabled={!inputAssetAmountX}
                                value={inputAmountX}
                                onChange={({ currentTarget }) => {
                                  const value = currentTarget.value;

                                  if (
                                    inputAssetAmountX?.asset.decimals === 0 &&
                                    /[,.]/.test(value)
                                  ) {
                                    return;
                                  }

                                  handleTokenAmountChange(value, 'input');
                                  props.input.onChange(value);
                                }}
                              />
                            </>
                          )}
                        </Field>
                      </Grid>
                      <Grid xs={24}>
                        <Field name="inputAmountY">
                          {(props: FieldRenderProps<string>) => (
                            <Input
                              placeholder="0.0"
                              label={inputAssetAmountY?.asset.name ?? ''}
                              width="100%"
                              {...props.input}
                              value={inputAmountY}
                              onChange={({ currentTarget }) => {
                                const value = currentTarget.value;

                                if (
                                  inputAssetAmountY?.asset.decimals === 0 &&
                                  /[,.]/.test(value)
                                ) {
                                  return;
                                }

                                handleTokenAmountChange(value, 'output');
                                props.input.onChange(value);
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      {!isFormDisabled && (
                        <Grid
                          xs={24}
                          alignItems="flex-start"
                          direction="column"
                        >
                          <Text h5>Deposit summary</Text>
                          <DepositSummary
                            lpTokensAmount={String(lpTokens)}
                            minerFee={minerFee}
                            dexFee={String(dexFee)}
                            totalFee={totalFee}
                          />
                        </Grid>
                      )}
                      <Grid xs={24} justify="center">
                        <Button htmlType="submit" disabled={isFormDisabled}>
                          {buttonState.text}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid.Container>
              </form>
            );
          }}
        />
      </Card>
    </>
  );
};
