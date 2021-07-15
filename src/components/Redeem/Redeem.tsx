import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  ErgoBox,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { WalletContext } from '../../context/WalletContext';
import { getButtonState, WalletStates } from './utils';
import { useGetAvailablePoolsByLPTokens } from '../../hooks/useGetAvailablePoolsByLPTokens';
import { defaultMinerFee, nanoErgInErg } from '../../constants/erg';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';

export const Redeem = (): JSX.Element => {
  const [{ minerFee, address: choosedAddress }] = useSettings();
  const [dexFee] = useState<number>(0.01);

  const { isWalletConnected } = useContext(WalletContext);
  const [amount, setAmount] = useState('');

  const [choosedPool, setChoosedPool] = useState<AmmPool | null>(null);

  const [utxos, setUtxos] = useState<ErgoBox[]>([]);
  const availablePools = useGetAvailablePoolsByLPTokens(utxos);
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
      ergo.get_utxos().then((data) => setUtxos(data ?? []));
    }
  }, [isWalletConnected]);

  const onSubmit = async () => {
    if (isWalletConnected && choosedPool && choosedAddress) {
      const network = new Explorer('https://api.ergoplatform.com');
      const poolId = choosedPool.id;

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(choosedAddress) as string;

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
              nErgs: evaluate(`(${minerFee}+${dexFee}) * ${nanoErgInErg}`),
              assets: [
                {
                  tokenId: choosedPool.lp.asset.id,
                  amount: Number(amount),
                },
              ],
            }) as BoxSelection,
            changeAddress: choosedAddress,
            selfAddress: choosedAddress,
            feeNErgs: BigInt(Number(minerFee) * nanoErgInErg),
            network: await network.getNetworkContext(),
          },
        )
        .then(async (d) => {
          const txId = await ergo.submit_tx(d);
          toast.success(`Transaction submitted: ${txId} `);
        })
        .catch((er) => toast.error(JSON.stringify(er)));
    }
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <Text h6>Need to connect wallet</Text>
      </Card>
    );
  }

  if (availablePools === null) {
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
            amount: '0',
            address: '',
          }}
          render={({ handleSubmit, errors = {} }) => (
            <form onSubmit={handleSubmit}>
              <Grid.Container gap={1}>
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
