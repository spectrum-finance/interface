import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Row,
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
import { useGetAvailablePoolsByLPTokens } from '../../hooks/useGetAvailablePoolsByLPTokens';
import { defaultMinerFee, nanoErgInErg } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';

export const Deposit = () => {
  const { isWalletConnected } = useContext(WalletContext);
  const [feePerToken, setFeePerToken] = useState('');
  const [amount, setAmount] = useState('');
  const [dexFee, setDexFee] = useState('0.01');

  const [choosedPool, setChoosedPool] = useState<AmmPool | null>(null);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [choosedAddress, setChoosedAddress] = useState('');
  const [utxos, setUtxos] = useState([]);
  const availablePools = useGetAllPools();
  const assetsAmountByLPAmount = useMemo(() => {
    if (!choosedPool || !amount) {
      return [];
    }

    return choosedPool.shares(
      new AssetAmount(choosedPool.lp.asset, BigInt(amount)),
    );
  }, [choosedPool, amount]);

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      choosedPool,
      amount,
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
  }, [isWalletConnected, amount, choosedPool]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => {
        setAddresses(data);
        setChoosedAddress(data[0]);
      });
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  // const onEnterFirstTokenAmount = (value: any) => {
  //   setFirstTokenAmount(value);

  //   if (choosedPool && firstTokenInfo && secondTokenInfo && value > 0) {
  //     const amount = choosedPool.outputAmount(
  //       new AssetAmount(
  //         firstTokenInfo,
  //         BigInt(
  //           evaluate(`${value}*10^${firstTokenInfo.decimals || 0}`).toFixed(0),
  //         ),
  //       ),
  //       1,
  //     );
  //     setSecondTokenAmount(
  //       String(
  //         evaluate(`${amount?.amount}/10^${secondTokenInfo.decimals || 0}`),
  //       ),
  //     );
  //     const feePerToken = Math.ceil(
  //       evaluate(
  //         `${defaultMinerFee} / (${amount?.amount}/10^${
  //           secondTokenInfo.decimals || 0
  //         })`,
  //       ),
  //     ).toFixed(0);
  //     setFeePerToken(feePerToken);
  //   }

  //   if (!value.trim()) {
  //     setSecondTokenAmount('');
  //     setFeePerToken('');
  //   }
  // };

  const onSubmit = async (values: any) => {
    if (isWalletConnected && choosedPool) {
      const network = new Explorer('https://api.ergoplatform.com');
      const poolId = choosedPool.id;

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(choosedAddress) as string;
      console.log(
        DefaultBoxSelector.select(utxos, {
          nErgs: evaluate(`${defaultMinerFee}+(${dexFee}* ${nanoErgInErg})`),
          assets: [
            {
              tokenId: choosedPool.lp.asset.id,
              amount: Number(amount),
            },
          ],
        }) as BoxSelection,
      );
      poolOps
        .redeem(
          {
            pk,
            poolId,
            dexFee: BigInt(evaluate(`${dexFee} * ${nanoErgInErg}`)),
            lp: choosedPool.lp.asset,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(
                `${defaultMinerFee}+(${dexFee}* ${nanoErgInErg})`,
              ),
              assets: [
                {
                  tokenId: choosedPool.lp.asset.id,
                  amount: Number(amount),
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
          console.log(d);
          // ergo.submit_tx(d);
          // alert(`Transaction submitted: ${d} `);
        })
        .catch((er) => console.log(13, er));
    }
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <Text h4>Need to connect wallet</Text>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <Text h4>Loading wallet...</Text>
      </Card>
    );
  }

  if (availablePools === null) {
    return (
      <Card>
        <Text h4>Fetching available pools...</Text>
      </Card>
    );
  }

  if (availablePools.length === 0) {
    return (
      <Card>
        <Text h4>No available pools to redeem</Text>
      </Card>
    );
  }
  console.log(assetsAmountByLPAmount);
  return (
    <>
      <Card>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            slippage: 1,
            amount: '0',
            address: '',
            dexFee: '0.01',
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
                  <Text h4>Fee per token</Text>
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
                      <Input
                        placeholder="0.0"
                        type="number"
                        width="100%"
                        {...props.input}
                        value={dexFee}
                        onChange={({ currentTarget }) => {
                          setDexFee(currentTarget.value as string);
                          props.input.onChange(currentTarget.value);
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid xs={24}>
                  <Text h4>Select pool</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="pool" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <Select
                        placeholder="Choose the pool"
                        width="100%"
                        {...props.input}
                        onChange={(value) => {
                          setChoosedPool(availablePools[Number(value)]);
                          props.input.onChange(value);
                        }}
                      >
                        {availablePools.map((pool: AmmPool, index) => (
                          <Select.Option key={pool.id} value={String(index)}>
                            {pool.assetX.name || pool.assetX.id.slice(0, 4)}/
                            {pool.assetY.name || pool.assetY.id.slice(0, 4)}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </Grid>
                <Grid xs={24}>
                  <Text h4>Amount</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="amount">
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        type="number"
                        width="100%"
                        {...props.input}
                        disabled={!choosedPool}
                        value={amount}
                        onKeyPress={(event) => {
                          return event.charCode >= 48 && event.charCode <= 57;
                        }}
                        onChange={({ currentTarget }) => {
                          setAmount(
                            Math.abs(Number(currentTarget.value)).toString(),
                          );
                          props.input.onChange(
                            Math.abs(Number(currentTarget.value)),
                          );
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                {choosedPool && (
                  <Grid xs={24}>
                    <Card>
                      <div>
                        {choosedPool?.assetX.name ||
                          choosedPool?.assetX.id.slice(0, 4)}{' '}
                        ={' '}
                        {assetsAmountByLPAmount.length > 0 &&
                          (assetsAmountByLPAmount[0]?.asset.id ===
                          choosedPool?.assetX.id
                            ? evaluate(
                                `${assetsAmountByLPAmount[0]?.amount}/10^${assetsAmountByLPAmount[0]?.asset.decimals}`,
                              )
                            : evaluate(
                                `${assetsAmountByLPAmount[1]?.amount}/10^${assetsAmountByLPAmount[1]?.asset.decimals}`,
                              ))}
                      </div>
                      <div>
                        {choosedPool?.assetY.name ||
                          choosedPool?.assetY.id.slice(0, 4)}{' '}
                        ={' '}
                        {assetsAmountByLPAmount.length > 0 &&
                          (assetsAmountByLPAmount[0]?.asset.id ===
                          choosedPool?.assetY.id
                            ? evaluate(
                                `${assetsAmountByLPAmount[0]?.amount}/10^${assetsAmountByLPAmount[0]?.asset.decimals}`,
                              )
                            : evaluate(
                                `${assetsAmountByLPAmount[1]?.amount}/10^${assetsAmountByLPAmount[1]?.asset.decimals}`,
                              ))}
                      </div>
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
