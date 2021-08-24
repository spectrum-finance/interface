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
import { reverse } from 'ramda';
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
import { getButtonState } from './buttonState';
import { useGetAvailablePoolsByLPTokens } from '../../hooks/useGetAvailablePoolsByLPTokens';
import { ERG_DECIMALS } from '../../constants/erg';
import { toast } from 'react-toastify';
import explorer from '../../services/explorer';
import { ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo/entities/ergoBox';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { poolActions } from '../../services/poolOptions';
import { miniSufficientValue } from '../../utils/ammMath';
import { calculateTotalFee } from '../../utils/transactions';
import { RedeemSummary } from './RedeemSummary';

export const Redeem = (): JSX.Element => {
  const [{ minerFee, address: chosenAddress }] = useSettings();
  const [dexFee] = useState<number>(0.01);

  const { isWalletConnected, ergBalance } = useContext(WalletContext);
  const [amount, setAmount] = useState('');
  const [LPTokensBalance, setLPTokensBalance] = useState<string | undefined>();
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();

  const totalFee = calculateTotalFee(minerFee, String(dexFee), {
    precision: ERG_DECIMALS,
  });

  const [utxos, setUtxos] = useState<ErgoBox[]>([]);
  const availablePools = useGetAvailablePoolsByLPTokens(utxos);
  const assetsAmountByLPAmount = useMemo(() => {
    if (!selectedPool || !amount) {
      return [];
    }

    return selectedPool.shares(
      new AssetAmount(selectedPool.lp.asset, parseUserInputToFractions(amount)),
    );
  }, [selectedPool, amount]);

  useEffect(() => {
    if (isWalletConnected && selectedPool) {
      ergo.get_balance(selectedPool.lp.asset.id).then(setLPTokensBalance);
    }
  }, [isWalletConnected, selectedPool]);

  const buttonState = getButtonState({
    isWalletConnected,
    selectedPool,
    amount,
    ergBalance,
    dexFee,
    minerFee,
    LPTokensBalance,
  });

  useEffect(() => {
    if (isWalletConnected) {
      ergo
        .get_utxos()
        .then((bs) => (bs ? bs.map((b) => ergoBoxFromProxy(b)) : bs))
        .then((data) => setUtxos(data ?? []));
    }
  }, [isWalletConnected]);

  const onSubmit = async () => {
    if (isWalletConnected && selectedPool && chosenAddress) {
      const network = explorer;
      const poolId = selectedPool.id;

      const pk = fromAddress(chosenAddress) as string;

      const actions = poolActions(selectedPool);

      actions
        .redeem(
          {
            pk,
            poolId,
            dexFee: parseUserInputToFractions(String(dexFee), ERG_DECIMALS),
            lp: selectedPool.lp.asset,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: miniSufficientValue(
                parseUserInputToFractions(minerFee, ERG_DECIMALS),
                parseUserInputToFractions(String(dexFee), ERG_DECIMALS),
              ),
              assets: [
                {
                  tokenId: selectedPool.lp.asset.id,
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
        <b>No available pools to redeem</b>
      </Card>
    );
  }
  const outputAssetXName =
    selectedPool?.assetX.name || selectedPool?.assetX.id.slice(0, 4);
  const outputAssetYName =
    selectedPool?.assetY.name || selectedPool?.assetY.id.slice(0, 4);

  const [outputAssetXAmount, outputAssetYAmount] =
    assetsAmountByLPAmount[0]?.asset.id === selectedPool?.assetX.id
      ? assetsAmountByLPAmount
      : reverse(assetsAmountByLPAmount);

  return (
    <>
      <Card>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            amount: '0',
            address: '',
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
                        <Select
                          placeholder="Choose the pool"
                          width="100%"
                          {...props.input}
                          onChange={(value) => {
                            setSelectedPool(availablePools[Number(value)]);
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
                    <Text h5>Amount</Text>
                  </Grid>
                  <Grid xs={24}>
                    <Field name="amount">
                      {(props: FieldRenderProps<string>) => (
                        <Input
                          placeholder="0.0"
                          width="100%"
                          {...props.input}
                          disabled={!selectedPool}
                          value={amount}
                          onKeyPress={(event) => {
                            // TODO: replace magic numbers with named constants
                            return event.charCode >= 48 && event.charCode <= 57;
                          }}
                          onChange={({ currentTarget }) => {
                            // TODO: add positive integer validation
                            try {
                              if (
                                !Number.isInteger(Number(currentTarget.value))
                              ) {
                                return;
                              }

                              const value = currentTarget.value;
                              setAmount(value);
                              props.input.onChange(value);
                            } catch (e) {
                              console.error('Redeem amount validaiton failed');
                            }
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  {!isFormDisabled && (
                    <Grid xs={24} alignItems="flex-start" direction="column">
                      <Text h5>Redeem summary</Text>
                      <RedeemSummary
                        outputAssetXName={outputAssetXName ?? ''}
                        outputAssetYName={outputAssetYName ?? ''}
                        outputAssetXAmount={renderFractions(
                          outputAssetXAmount.amount,
                          outputAssetXAmount.asset.decimals,
                        )}
                        outputAssetYAmount={renderFractions(
                          outputAssetYAmount.amount,
                          outputAssetYAmount.asset.decimals,
                        )}
                        minerFee={minerFee}
                        dexFee={String(dexFee)}
                        totalFee={totalFee}
                      />
                    </Grid>
                  )}
                  <Grid xs={24} justify="center">
                    <Button
                      htmlType="submit"
                      disabled={
                        buttonState.isDisabled ||
                        Object.values(errors).length > 0
                      }
                    >
                      {buttonState.text}
                    </Button>
                  </Grid>
                </Grid.Container>
              </form>
            );
          }}
        />
      </Card>
    </>
  );
};
