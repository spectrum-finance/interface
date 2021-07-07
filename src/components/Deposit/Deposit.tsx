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
  Select,
  Text,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { evaluate } from 'mathjs';
import { AmmPool, Explorer, T2tPoolOps } from 'ergo-dex-sdk';
import { YoroiProver } from '../../utils/yoroiProver';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext } from '../../context/WalletContext';
import { getButtonState, WalletStates } from './utils';
import { defaultMinerFee, nanoErgInErg } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { useSettings } from '../../context/SettingsContext';

export const Deposit = (): JSX.Element => {
  const [{ dexFee: defaultDexFee, slippage: defaultSlippage }] = useSettings();
  const { isWalletConnected } = useContext(WalletContext);
  const [dexFee, setDexFee] = useState(defaultDexFee);
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
  const [inputAssetAmount, setInputAssetAmount] =
    useState<AssetAmount | undefined>();
  const [outputAssetAmount, setOutputAssetAmount] =
    useState<AssetAmount | undefined>();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');

  const lpTokens = useMemo(() => {
    if (
      selectedPool &&
      inputAmount &&
      inputAssetAmount &&
      outputAmount &&
      outputAssetAmount
    ) {
      return selectedPool.rewardLP(
        new AssetAmount(
          inputAssetAmount.asset,
          BigInt(
            evaluate(
              `${inputAmount}*10^${inputAssetAmount.asset.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
        new AssetAmount(
          outputAssetAmount.asset,
          BigInt(
            evaluate(
              `${outputAmount}*10^${outputAssetAmount.asset.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
      ).amount;
    }

    return '';
  }, [
    selectedPool,
    inputAmount,
    inputAssetAmount,
    outputAmount,
    outputAssetAmount,
  ]);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [choosedAddress, setChoosedAddress] = useState('');
  const [utxos, setUtxos] = useState([]);
  const availablePools = useGetAllPools();

  const updateSelectedPool = useCallback((pool: AmmPool) => {
    setSelectedPool(pool);
    setInputAssetAmount(pool.x);
    setOutputAssetAmount(pool.y);
  }, []);

  useEffect(() => {
    if (selectedPool === undefined && availablePools) {
      updateSelectedPool(availablePools[0]);
    }
  }, [availablePools]);

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      selectedPool,
      inputAmount,
      outputAmount,
    });
    switch (buttonState) {
      case WalletStates.NEED_TO_SELECT_POOL: {
        return { disabled: true, text: 'Need to select pool' };
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
  }, [isWalletConnected, inputAmount, outputAmount, selectedPool]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => {
        setAddresses(data);
        setChoosedAddress(data[0]);
      });
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  const onEnterTokenAmount = (value: string, token: 'input' | 'output') => {
    if (!selectedPool || !inputAssetAmount || !outputAssetAmount) {
      return;
    }

    if (token === 'input') {
      setInputAmount(value);

      if (Number(value) > 0) {
        const amount = selectedPool.depositAmount(
          new AssetAmount(
            inputAssetAmount.asset,
            BigInt(
              evaluate(
                `${value}*10^${inputAssetAmount.asset.decimals || 0}`,
              ).toFixed(0),
            ),
          ),
        );

        setOutputAmount(
          String(
            evaluate(
              `${amount?.amount}/10^${outputAssetAmount.asset.decimals || 0}`,
            ),
          ),
        );
      }

      if (!value.trim()) {
        setOutputAmount('');
      }
    }

    if (token === 'output') {
      setOutputAmount(value);

      if (Number(value) > 0) {
        const amount = selectedPool.depositAmount(
          new AssetAmount(
            outputAssetAmount.asset,
            BigInt(
              evaluate(
                `${value}*10^${outputAssetAmount.asset.decimals || 0}`,
              ).toFixed(0),
            ),
          ),
        );

        setInputAmount(
          String(
            evaluate(
              `${amount?.amount}/10^${inputAssetAmount.asset.decimals || 0}`,
            ),
          ),
        );
      }

      if (!value.trim()) {
        setInputAmount('');
      }
    }
  };

  const onSubmit = async (values: any) => {
    if (
      isWalletConnected &&
      selectedPool &&
      inputAssetAmount &&
      outputAssetAmount
    ) {
      const network = new Explorer('https://api.ergoplatform.com');
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
            dexFee: BigInt(evaluate(`${dexFee} * ${nanoErgInErg}`)),
            x: selectedPool.assetX,
            y: selectedPool.assetY,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(
                `${defaultMinerFee}+(${dexFee}* ${nanoErgInErg})`,
              ),
              assets: [
                {
                  tokenId: inputAssetAmount.asset.id,
                  amount: evaluate(
                    `${inputAmount}*10^${inputAssetAmount.asset.decimals || 0}`,
                  ).toFixed(0),
                },
                {
                  tokenId: outputAssetAmount.asset.id,
                  amount: evaluate(
                    `${outputAmount}*10^${
                      outputAssetAmount.asset.decimals || 0
                    }`,
                  ).toFixed(0),
                },
              ],
            }) as BoxSelection,
            changeAddress: choosedAddress,
            selfAddress: choosedAddress,
            feeNErgs: BigInt(defaultMinerFee),
            network: await network.getNetworkContext(),
          },
        )
        .then((d: any) => {
          console.log(421, d);
          // ergo.submit_tx(d);
          // alert(`Transaction submitted: ${d} `);
        })
        .catch((er) => console.log(13, er));
    }
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <Text h6>Need to connect wallet</Text>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <Loading>Loading wallet</Loading>
      </Card>
    );
  }

  if (!availablePools) {
    return (
      <Card>
        <Loading>Fetching available pools</Loading>
      </Card>
    );
  }

  if (availablePools?.length === 0) {
    return (
      <Card>
        <Loading>No available pools to redeem</Loading>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            slippage: defaultSlippage,
            amount: '0',
            address: '',
            dexFee,
          }}
          render={({ handleSubmit, values, errors = {} }) => (
            <form onSubmit={handleSubmit}>
              <Grid.Container gap={1}>
                {isWalletConnected && addresses.length !== 0 && (
                  <>
                    <Grid xs={24}>
                      <Text h4>Choose Address</Text>
                    </Grid>
                    <Grid xs={24}>
                      <Field name="address" component="select">
                        {(props: FieldRenderProps<string>) => (
                          <Select
                            placeholder="0.0"
                            width="100%"
                            {...props.input}
                            value={addresses[0]}
                            onChange={(value) => {
                              setChoosedAddress(value as string);
                              props.input.onChange(value);
                            }}
                          >
                            {addresses.map((address: string) => (
                              <Select.Option key={address} value={address}>
                                {address}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </Grid>
                  </>
                )}

                <Grid xs={24}>
                  <Text h4>Slippage</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="slippage">
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        type="number"
                        width="100%"
                        {...props.input}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid xs={24}>
                  <Text h4>Dex fee</Text>
                </Grid>
                <Grid xs={24}>
                  <Field
                    name="dexFee"
                    validate={(value) => {
                      if (!value || !value.trim()) {
                        return;
                      }
                      if (value < 0.01) {
                        return 'Minimum fee is 0.01 erg';
                      }
                    }}
                  >
                    {(props: FieldRenderProps<string>) => (
                      <>
                        <Input
                          placeholder="0.01"
                          type="number"
                          width="100%"
                          {...props.input}
                          value={dexFee}
                          onChange={({ currentTarget }) => {
                            setDexFee(currentTarget.value as string);
                            props.input.onChange(currentTarget.value);
                          }}
                        />
                        {props.meta.error && <p>{props.meta.error}</p>}
                      </>
                    )}
                  </Field>
                </Grid>
                <Grid xs={24}>
                  <Text h4>Select pool</Text>
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

                <Grid xs={24}>
                  <Text h4>First Token</Text>
                </Grid>
                <Grid xs={24}>
                  <Field
                    name="inputAmount"
                    validate={(value) => {
                      if (!value || !value.trim()) {
                        return;
                      }
                      const comma = value.match('[,.]');
                      if (comma && !inputAssetAmount?.asset.decimals) {
                        return 'No decimals at this token after comma';
                      }

                      if (
                        comma &&
                        value.substr(comma.index + 1) >
                          (inputAssetAmount?.asset.decimals || 0)
                      ) {
                        return `Max decimals at this token after comma is ${
                          inputAssetAmount?.asset.decimals || 0
                        }`;
                      }
                    }}
                  >
                    {(props: FieldRenderProps<string>) => (
                      <>
                        <Input
                          placeholder="0.0"
                          type="number"
                          width="100%"
                          lang="en"
                          label={inputAssetAmount?.asset.name ?? ''}
                          {...props.input}
                          disabled={!inputAssetAmount}
                          value={inputAmount}
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
                  <Text h4>Second Token</Text>
                </Grid>
                <Grid xs={24}>
                  <Field
                    name="outputAmount"
                    validate={(value) => {
                      if (!value || !value.trim()) {
                        return;
                      }
                      const comma = value.match('[,.]');
                      if (comma && !inputAssetAmount?.asset.decimals) {
                        return 'No decimals at this token after comma';
                      }

                      if (
                        comma &&
                        value.substr(comma.index + 1) >
                          (inputAssetAmount?.asset.decimals || 0)
                      ) {
                        return `Max decimals at this token after comma is ${
                          inputAssetAmount?.asset.decimals || 0
                        }`;
                      }
                    }}
                  >
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        type="number"
                        label={outputAssetAmount?.asset.name ?? ''}
                        width="100%"
                        {...props.input}
                        value={outputAmount}
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
                      buttonStatus.disabled || Object.values(errors).length > 0
                    }
                  >
                    {buttonStatus.text}
                  </Button>
                </Grid>
              </Grid.Container>
            </form>
          )}
        />
      </Card>
    </>
  );
};
