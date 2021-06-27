import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Grid,
  Input,
  Select,
  Text,
} from '@geist-ui/react';
import { filter } from 'ramda';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { evaluate } from 'mathjs';
import {
  AmmPool,
  Explorer,
  NetworkPools,
  RustModule,
  T2tPoolOps,
} from 'ergo-dex-sdk';
import { YoroiProver } from '../../utils/yoroiProver';
import {
  AssetAmount,
  AssetInfo,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTransactions,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { getTokenInfo } from '../../utils/getTokenInfo';
import { WalletContext } from '../../context/WalletContext';
import { defaultMinerFee } from '../../constants/erg';
// import { fromAddress } from ;
// import { T2tPoolOps } from 'ergo-dex-sdk';
// import { NetworkPools } from 'ergo-dex-sdk';
// import { Explorer } from 'ergo-dex-sdk';
// import { ErgoBox } from 'ergo-dex-sdk';
// import { BoxSelection } from 'ergo-dex-sdk';
// import { TransactionContext } from 'ergo-dex-sdk';

interface Swap {
  isWalletConnected: boolean;
}
enum WalletStates {
  NEED_TO_CONNECT_WALLET = 'NEED_TO_CONNECT_WALLET',
  SELECT_A_TOKEN = 'SELECT_A_TOKEN',
  NO_LIQUIDITY = 'NO_LIQUIDITY',
  NEED_TO_ENTER_AMOUNT = 'NEED_TO_ENTER_AMOUNT',
  SUBMIT = 'SUBMIT',
  LOADING = 'LOADING',
}
// function chooseBoxes(boxes: ErgoBox[]): BoxSelection;
const getButtonState = ({
  isWalletConnected,
  choosedPool,
  firstTokenId,
  secondTokenId,
  firstTokenAmount,
  secondTokenAmount,
}: any) => {
  if (!isWalletConnected) {
    return WalletStates.NEED_TO_CONNECT_WALLET;
  }

  if (!firstTokenId || !secondTokenId) {
    return WalletStates.SELECT_A_TOKEN;
  }

  if (!firstTokenAmount || !secondTokenAmount) {
    return WalletStates.NEED_TO_ENTER_AMOUNT;
  }

  if (choosedPool) {
    return WalletStates.SUBMIT;
  }

  return WalletStates.LOADING;
};

export const Swap = () => {
  const { isWalletConnected } = useContext(WalletContext);
  const [feePerToken, setFeePerToken] = useState('');
  const [firstTokenId, setFirstTokenId] = useState('');
  const [secondTokenId, setSecondTokenId] = useState('');
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [firstTokenInfo, setFirstTokenInfo] = useState<AssetInfo | undefined>(
    undefined,
  );
  const [secondTokenInfo, setSecondTokenInfo] = useState<AssetInfo | undefined>(
    undefined,
  );
  const pools = useGetAllPools();

  const choosedPool = useMemo(() => {
    if (!firstTokenId.trim() || !secondTokenId.trim()) {
      return null;
    }
    return pools?.find(
      (ammPool) =>
        (ammPool.assetX.id === firstTokenId &&
          ammPool.assetY.id === secondTokenId) ||
        (ammPool.assetX.id === secondTokenId &&
          ammPool.assetY.id === firstTokenId),
    );
  }, [firstTokenId, secondTokenId, pools]);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [utxos, setUtxos] = useState([]);

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      firstTokenId,
      secondTokenId,
      choosedPool,
      firstTokenAmount,
      secondTokenAmount,
    });
    switch (buttonState) {
      case WalletStates.SELECT_A_TOKEN: {
        return { disabled: true, text: 'Select a token' };
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
      case WalletStates.LOADING: {
        return { disabled: true, text: 'Loading...' };
      }
    }
  }, [isWalletConnected, firstTokenId, secondTokenId, choosedPool]);

  const availableTokens: Record<string, AssetInfo> = useMemo(() => {
    return (
      pools?.reduce((acc, { assetX, assetY }) => {
        acc[assetX.id] = { ...assetX };
        acc[assetY.id] = { ...assetY };
        return acc;
      }, {} as any) || {}
    );
  }, [pools]);

  const firstSelectTokens = useMemo(() => {
    return Object.values(
      filter((tokenData) => tokenData.id !== secondTokenId, availableTokens),
    ).map((tokenData) => ({
      label: tokenData.name || tokenData.id,
      value: tokenData.id,
    }));
  }, [availableTokens, secondTokenId]);

  const secondSelectTokens = useMemo(() => {
    return Object.values(
      filter((tokenData) => tokenData.id !== firstTokenId, availableTokens),
    ).map((tokenData) => ({
      label: tokenData.name || tokenData.id,
      value: tokenData.id,
    }));
  }, [availableTokens, firstTokenId]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => setAddresses(data));
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  const onSelectFirstToken = (value: any) => {
    setFirstTokenId(value);

    getTokenInfo(value).then((data) => setFirstTokenInfo(data));
  };

  const onSelectSecondToken = (value: any) => {
    setSecondTokenId(value);
    getTokenInfo(value).then((data) => setSecondTokenInfo(data));
  };

  const onEnterFirstTokenAmount = (value: any) => {
    setFirstTokenAmount(value);

    if (choosedPool && firstTokenInfo && secondTokenInfo && value > 0) {
      const amount = choosedPool.outputAmount(
        new AssetAmount(
          firstTokenInfo,
          BigInt(
            evaluate(`${value}*10^${firstTokenInfo.decimals || 0}`).toFixed(0),
          ),
        ),
        1,
      );
      setSecondTokenAmount(
        String(
          evaluate(`${amount?.amount}/10^${secondTokenInfo.decimals || 0}`),
        ),
      );
      const feePerToken = Math.ceil(
        evaluate(
          `${defaultMinerFee} / (${amount?.amount}/10^${
            secondTokenInfo.decimals || 0
          })`,
        ),
      ).toFixed(0);
      setFeePerToken(feePerToken);
    }

    if (!value.trim()) {
      setSecondTokenAmount('');
      setFeePerToken('');
    }
  };
  console.log(
    evaluate(
      `${defaultMinerFee}+(${secondTokenAmount || 0} * ${feePerToken || 0})`,
    ),
  );
  const onSubmit = async (values: any) => {
    if (isWalletConnected && choosedPool && firstTokenInfo && secondTokenInfo) {
      const network = new Explorer('https://api.ergoplatform.com');
      // // выбрать pool из селекта
      const poolId = choosedPool.id;
      // const yoroiWalletProver = {} as any;
      const baseInput = choosedPool.x.withAmount(10n);

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(addresses[0]) as string;
      const minQuoteOutput = choosedPool.outputAmount(baseInput, 1).amount;
      const dexFeePerToken = BigInt(feePerToken);
      const poolFeeNum = choosedPool.poolFeeNum;

      poolOps
        .swap(
          {
            pk,
            poolId,
            baseInput,
            minQuoteOutput,
            dexFeePerToken,
            quoteAsset: secondTokenId,
            poolFeeNum,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(
                `${defaultMinerFee}+(${secondTokenAmount} * ${feePerToken})`,
              ),
              assets: [
                {
                  tokenId: firstTokenId,
                  amount: evaluate(
                    `(${firstTokenAmount} * 10^${
                      firstTokenInfo.decimals || 0
                    })`,
                  ).toFixed(0),
                },
              ],
            }) as BoxSelection,
            changeAddress: values.address,
            selfAddress: values.address,
            feeNErgs: BigInt(defaultMinerFee),
            network: await network.getNetworkContext(),
          },
        )
        .then((d: any) => console.log(d))
        .catch((er) => console.log(13, er));
      //
      // const transCtx = new TransactionContext(
      //   chooseBoxes(boxes),
      //   await ergo.get_change_address(),
      //   1000000n,
      //   null as any,
      //   // poolNetwork
      // );
      // const swapTransaction = await pool.swap(
      //   {
      //     pk,
      //     poolScriptHash,
      //     baseInput,
      //     minQuoteOutput: chosenPool.outputAmount(baseInput, values.slippage),
      //     dexFeePerToken: values, // брать с инпута комиссия заплаченная за каждый обмененный токен
      //     poolFeeNum: chosenPool.poolFeeNum,
      //     quoteAsset: chosenPool.y.asset,
      //   },
      //   transCtx,
      // );
      // const submittedTx = await ergo.submit_tx(swapTransaction);
      // console.log(pk);
      //
    }
  };

  return (
    <>
      <Card>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            slippage: 1,
            firstTokenAmount: 0.0,
            secondTokenAmount: 0.0,
            firstTokenName: '',
            secondTokenName: '',
            address: '',
            feePerToken: 0,
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
                  <Text h4>Fee per token</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="feePerToken">
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        type="number"
                        width="100%"
                        {...props.input}
                        disabled={!secondTokenAmount}
                        value={feePerToken}
                        onChange={({ currentTarget }) => {
                          setFeePerToken(currentTarget.value as string);
                          props.input.onChange(currentTarget.value);
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid xs={24}>
                  <Text h4>From</Text>
                </Grid>
                <Grid xs={6}>
                  <Field name="firstTokenName" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <Select
                        placeholder="Token"
                        style={{ minWidth: '80px' }}
                        {...props.input}
                        onChange={(value) => {
                          onSelectFirstToken(value as string);
                          props.input.onChange(value);
                        }}
                      >
                        {firstSelectTokens.map(({ value, label }) => (
                          <Select.Option key={value} value={value}>
                            {label || value}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </Grid>
                <Grid xs={18}>
                  <Field
                    name="firstTokenAmount"
                    validate={(value) => {
                      if (!value || !value.trim()) {
                        return;
                      }
                      const comma = value.match('[,.]');
                      if (comma && !firstTokenInfo?.decimals) {
                        return 'No decimals at this token after comma';
                      }

                      if (
                        comma &&
                        value.substr(comma.index + 1) >
                          (firstTokenInfo?.decimals || 0)
                      ) {
                        return `Max decimals at this token after comma is ${
                          firstTokenInfo?.decimals || 0
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
                          {...props.input}
                          disabled={!firstTokenInfo || !firstTokenId}
                          value={firstTokenAmount}
                          onChange={({ currentTarget }) => {
                            const value = currentTarget.value;
                            onEnterFirstTokenAmount(value);
                            props.input.onChange(value);
                          }}
                        />
                        {props.meta.error && <p>{props.meta.error}</p>}
                      </>
                    )}
                  </Field>
                </Grid>
                <Grid xs={24}>
                  <Text h4>To</Text>
                </Grid>
                <Grid xs={6}>
                  <Field name="secondTokenName" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <Select
                        placeholder="Token"
                        style={{ minWidth: '80px' }}
                        {...props.input}
                        onChange={(value) => {
                          onSelectSecondToken(value as string);
                          props.input.onChange(value);
                        }}
                      >
                        {secondSelectTokens.map(({ value, label }) => (
                          <Select.Option key={value} value={value}>
                            {label || value}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </Grid>
                <Grid xs={18}>
                  <Field name="secondTokenAmount">
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        type="number"
                        width="100%"
                        {...props.input}
                        value={secondTokenAmount}
                        onChange={(e) => {
                          props.input.onChange(e.currentTarget.value);
                        }}
                        disabled={true}
                      />
                    )}
                  </Field>
                </Grid>
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
