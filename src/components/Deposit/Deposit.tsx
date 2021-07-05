import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Card, Grid, Input, Select, Text } from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { evaluate } from 'mathjs';
import { AmmPool, Explorer, T2tPoolOps } from 'ergo-dex-sdk';
import { YoroiProver } from '../../utils/yoroiProver';
import {
  AssetAmount,
  AssetInfo,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext } from '../../context/WalletContext';
import { getButtonState, WalletStates } from './utils';
import { defaultMinerFee, nanoErgInErg } from '../../constants/erg';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { getTokenInfo } from '../../utils/getTokenInfo';
import { filter } from 'ramda';

export const Deposit = () => {
  const { isWalletConnected } = useContext(WalletContext);
  const [dexFee, setDexFee] = useState('0.01');
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

  const [choosedPool, setChoosedPool] = useState<AmmPool | null>(null);

  const lpTokens = useMemo(() => {
    if (
      choosedPool &&
      firstTokenAmount &&
      firstTokenInfo &&
      secondTokenAmount &&
      secondTokenInfo
    ) {
      return choosedPool.rewardLP(
        new AssetAmount(
          firstTokenInfo,
          BigInt(
            evaluate(
              `${firstTokenAmount}*10^${firstTokenInfo.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
        new AssetAmount(
          secondTokenInfo,
          BigInt(
            evaluate(
              `${secondTokenAmount}*10^${secondTokenInfo.decimals || 0}`,
            ).toFixed(0),
          ),
        ),
      ).amount;
    }

    return '';
  }, [
    choosedPool,
    firstTokenAmount,
    firstTokenInfo,
    secondTokenAmount,
    secondTokenInfo,
  ]);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [choosedAddress, setChoosedAddress] = useState('');
  const [utxos, setUtxos] = useState([]);
  const availablePools = useGetAllPools();

  const availableTokens: Record<string, AssetInfo> = useMemo(() => {
    if (!choosedPool) {
      return [];
    }
    return (
      [choosedPool.assetX, choosedPool.assetY]?.reduce((acc, asset) => {
        acc[asset.id] = { ...asset };
        return acc;
      }, {} as any) || {}
    );
  }, [choosedPool]);

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

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      choosedPool,
      firstTokenAmount,
      secondTokenAmount,
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
  }, [isWalletConnected, firstTokenAmount, secondTokenAmount, choosedPool]);

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
    if (!choosedPool || !firstTokenInfo || !secondTokenInfo) {
      return;
    }

    if (token === 'input') {
      setFirstTokenAmount(value);

      if (Number(value) > 0) {
        const amount = choosedPool.depositAmount(
          new AssetAmount(
            firstTokenInfo,
            BigInt(
              evaluate(`${value}*10^${firstTokenInfo.decimals || 0}`).toFixed(
                0,
              ),
            ),
          ),
        );

        setSecondTokenAmount(
          String(
            evaluate(`${amount?.amount}/10^${secondTokenInfo.decimals || 0}`),
          ),
        );
      }

      if (!value.trim()) {
        setSecondTokenAmount('');
      }
    }

    if (token === 'output') {
      setSecondTokenAmount(value);

      if (Number(value) > 0) {
        const amount = choosedPool.depositAmount(
          new AssetAmount(
            secondTokenInfo,
            BigInt(
              evaluate(`${value}*10^${secondTokenInfo.decimals || 0}`).toFixed(
                0,
              ),
            ),
          ),
        );

        setFirstTokenAmount(
          String(
            evaluate(`${amount?.amount}/10^${firstTokenInfo.decimals || 0}`),
          ),
        );
      }

      if (!value.trim()) {
        setFirstTokenAmount('');
      }
    }
  };

  const onSelectFirstToken = (value: any) => {
    setFirstTokenId(value);

    getTokenInfo(value).then((data) => setFirstTokenInfo(data));
  };

  const onSelectSecondToken = (value: any) => {
    setSecondTokenId(value);
    getTokenInfo(value).then((data) => setSecondTokenInfo(data));
  };

  const onSubmit = async (values: any) => {
    if (isWalletConnected && choosedPool && firstTokenInfo && secondTokenInfo) {
      const network = new Explorer('https://api.ergoplatform.com');
      const poolId = choosedPool.id;

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(choosedAddress) as string;

      const t1 = poolOps
        .deposit(
          {
            pk,
            poolId,
            dexFee: BigInt(evaluate(`${dexFee} * ${nanoErgInErg}`)),
            x: choosedPool.assetX,
            y: choosedPool.assetY,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(
                `${defaultMinerFee}+(${dexFee}* ${nanoErgInErg})`,
              ),
              assets: [
                {
                  tokenId: firstTokenInfo.id,
                  amount: evaluate(
                    `${firstTokenAmount}*10^${firstTokenInfo.decimals || 0}`,
                  ).toFixed(0),
                },
                {
                  tokenId: secondTokenInfo.id,
                  amount: evaluate(
                    `${secondTokenAmount}*10^${secondTokenInfo.decimals || 0}`,
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

  if (availablePools?.length === 0) {
    return (
      <Card>
        <Text h4>No available pools to redeem</Text>
      </Card>
    );
  }

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
                      <Select
                        placeholder="Choose the pool"
                        width="100%"
                        {...props.input}
                        onChange={(value) => {
                          if (availablePools) {
                            setChoosedPool(availablePools[Number(value)]);
                          }
                          props.input.onChange(value);
                        }}
                      >
                        {availablePools?.map((pool: AmmPool, index) => (
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
                        onChange={({ currentTarget }) => {
                          const { value } = currentTarget;
                          onEnterTokenAmount(value, 'output');
                          props.input.onChange(value);
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                {choosedPool && (
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
