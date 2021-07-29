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
import { getButtonState, WalletStates } from './utils';
import { useGetAvailablePoolsByLPTokens } from '../../hooks/useGetAvailablePoolsByLPTokens';
import { ERG_DECIMALS } from '../../constants/erg';
import { toast } from 'react-toastify';
import explorer from '../../services/explorer';
import { ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';
import { parseUserInputToFractions } from '../../utils/math';
import poolOptions from '../../services/poolOptions';

export const Redeem = (): JSX.Element => {
  const [{ minerFee, address: chosenAddress }] = useSettings();
  const [dexFee] = useState<number>(0.01);

  const { isWalletConnected } = useContext(WalletContext);
  const [amount, setAmount] = useState('');

  const [chosenPool, setChosenPool] = useState<AmmPool | undefined>(undefined);

  const [utxos, setUtxos] = useState<ErgoBox[]>([]);
  const availablePools = useGetAvailablePoolsByLPTokens(utxos);
  const assetsAmountByLPAmount = useMemo(() => {
    if (!chosenPool || !amount) {
      return [];
    }

    return chosenPool.shares(
      new AssetAmount(chosenPool.lp.asset, BigInt(amount)),
    );
  }, [chosenPool, amount]);

  const buttonStatus = useMemo(() => {
    const buttonState = getButtonState({
      isWalletConnected,
      chosenPool,
      amount,
    });
    switch (buttonState) {
      case WalletStates.NEED_TO_SELECT_POOL: {
        return { disabled: true, text: 'Wallet not selected' };
      }
      case WalletStates.SUBMIT: {
        return { disabled: false, text: 'Submit' };
      }
      case WalletStates.NEED_TO_CONNECT_WALLET: {
        return { disabled: true, text: 'Wallet not connected' };
      }
      case WalletStates.NEED_TO_ENTER_AMOUNT: {
        return { disabled: true, text: 'LP amount not specified' };
      }
    }
  }, [isWalletConnected, amount, chosenPool]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo
        .get_utxos()
        .then((bs) => (bs ? bs.map((b) => ergoBoxFromProxy(b)) : bs))
        .then((data) => setUtxos(data ?? []));
    }
  }, [isWalletConnected]);

  const onSubmit = async () => {
    if (isWalletConnected && chosenPool && chosenAddress) {
      const network = explorer;
      const poolId = chosenPool.id;

      const pk = fromAddress(chosenAddress) as string;

      poolOptions
        .redeem(
          {
            pk,
            poolId,
            dexFee: parseUserInputToFractions(String(dexFee), ERG_DECIMALS),
            lp: chosenPool.lp.asset,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: parseUserInputToFractions(minerFee + dexFee, ERG_DECIMALS),
              assets: [
                {
                  tokenId: chosenPool.lp.asset.id,
                  amount: BigInt(amount),
                },
              ],
            }) as BoxSelection,
            changeAddress: chosenAddress,
            selfAddress: chosenAddress,
            feeNErgs: parseUserInputToFractions(minerFee, ERG_DECIMALS),
            network: await network.getNetworkContext(),
          },
        )
        .then(async (tx) => {
          const txId = await ergo.submit_tx(ergoTxToProxy(tx));
          toast.success(`Transaction submitted: ${txId} `);
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
                  <Text h5>Pool</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="pool" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <Select
                        placeholder="Choose the pool"
                        width="100%"
                        {...props.input}
                        onChange={(value) => {
                          setChosenPool(availablePools[Number(value)]);
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
                        disabled={!chosenPool}
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
                {chosenPool && (
                  <Grid xs={24}>
                    <Card>
                      <div>
                        {chosenPool?.assetX.name ||
                          chosenPool?.assetX.id.slice(0, 4)}{' '}
                        ={' '}
                        {assetsAmountByLPAmount.length > 0 &&
                          (assetsAmountByLPAmount[0]?.asset.id ===
                          chosenPool?.assetX.id
                            ? evaluate(
                                `${assetsAmountByLPAmount[0]?.amount}/10^${assetsAmountByLPAmount[0]?.asset.decimals}`,
                              )
                            : evaluate(
                                `${assetsAmountByLPAmount[1]?.amount}/10^${assetsAmountByLPAmount[1]?.asset.decimals}`,
                              ))}
                      </div>
                      <div>
                        {chosenPool?.assetY.name ||
                          chosenPool?.assetY.id.slice(0, 4)}{' '}
                        ={' '}
                        {assetsAmountByLPAmount.length > 0 &&
                          (assetsAmountByLPAmount[0]?.asset.id ===
                          chosenPool?.assetY.id
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
