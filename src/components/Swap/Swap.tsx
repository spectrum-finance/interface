import React, { useCallback, useEffect, useState } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Grid,
  Input,
  Select,
  Text,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { Explorer, NetworkPools, RustModule, T2tPoolOps } from 'ergo-dex-sdk';
import { YoroiProver } from '../../utils/yoroiProver';
import {
  BoxSelection,
  DefaultBoxSelector,
  DefaultTransactions,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
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

// function chooseBoxes(boxes: ErgoBox[]): BoxSelection;

const getPoolByPair = (tokenId1: any, tokenId2: any) => {
  return {
    id: '12',
    x: [],
    y: [],
  };
};

export const Swap = ({ isWalletConnected }: Swap) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [utxos, setUtxos] = useState([]);
  const currencies = [
    { label: 'ETH', value: 'ETH' },
    { label: 'ERG', value: 'ERG' },
  ]; //getPools { identifierPool: 12 }

  const onSwap = useCallback(() => {
    if (isWalletConnected) {
      //
    }
    console.log(isWalletConnected);
  }, [isWalletConnected]);

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => setAddresses(data));
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  const onInputFirstAmount = () => ({});

  const onInputSecondAmount = () => ({});

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => setAddresses(data));
    }
  }, [isWalletConnected]);

  const onSubmit = async (values: any) => {
    if (isWalletConnected) {
      // const pk = fromAddress(values.address)!;
      await RustModule.load();
      const network = new Explorer('https://api.ergoplatform.com');
      const poolNetwork = new NetworkPools(network);
      // // выбрать pool из селекта
      const pools = await poolNetwork.getAll({ limit: 100, offset: 0 });
      console.log(123, pools);
      const chosenPool = pools[0][0];
      const poolScriptHash = chosenPool.poolScriptHash;
      // const yoroiWalletProver = {} as any;
      const baseInput = chosenPool.x.withAmount(10n);

      const poolOps = new DefaultTransactions(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(addresses[0]) as string;
      poolOps
        .simple(
          'PT6XSsf8tanNKVKyMzSBT5QfTFmdSgG2fPT84CCS818LxtayX4v6yR5RNpTybWHbjyQxdgPTzyM5NwkJ3oNeDDWXfS4tneegkRUfc83YryJ1p8Ax1w3jcpsFkmS83db1hwsWwnkqaW47VJ46YQvMSNquMVWxWVoPQoW5eVizsqyXRthWJwiEja51Qo91mULBCuRs9BAAtyXboXUb9NF3RKk4XU8ACfYuYndSUVDwqajgAeXKtN4J92dcTVJq7iQ4Pfa8iu9VVfDCda8kvPGmMwtr7jtCH2bNMQWAyGoad5yFUDiBKaXz2KP7vd3EjWBRU6WBsfBhNM2ZFp5kcfARXSaHH4x3zZnsguhzdR64zDxKsA9THvCmhDegLgfieAi1pCxjdAyTVThR2Hwx5w2RDKkb39i8MXJihkZto1EE9ic51LUnBjaHQreLoA88H9dcbwMqo8MZPyrut1x88qZz1UDCgAa2nWw4qtU3XuJBudGrGJjTKXpcyEywSz9k6NtStD',
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: 20000000,
              assets: [
                {
                  tokenId:
                    'f45c4f0d95ce1c64defa607d94717a9a30c00fdd44827504be20db19f4dce36f',
                  amount: 10,
                },
              ],
            }) as BoxSelection,
            changeAddress:
              '9g9cdHhNZvtUvMveqEEfk28JZasEC8sJamV3E6d5JHv8VYUjjbX',
            selfAddress: '9g9cdHhNZvtUvMveqEEfk28JZasEC8sJamV3E6d5JHv8VYUjjbX',
            feeNErgs: 10000000n,
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
    console.log(values);
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
            firstTokenName: 'ETH',
            secondTokenName: 'ERG',
            address: '',
          }}
          render={({ handleSubmit, form }) => (
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
                  <Text h4>From</Text>
                </Grid>
                <Grid xs={6}>
                  <Field name="firstTokenName" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <AutoComplete
                        disableFreeSolo
                        options={currencies}
                        initialValue="ETH"
                        {...props.input}
                        onSelect={props.input.onChange}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid xs={18}>
                  <Field name="firstTokenAmount">
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
                  <Text h4>To</Text>
                </Grid>
                <Grid xs={6}>
                  <Field name="secondTokenName" component="select">
                    {(props: FieldRenderProps<string>) => (
                      <AutoComplete
                        disableFreeSolo
                        options={currencies}
                        initialValue="ERG"
                        {...props.input}
                        onSelect={props.input.onChange}
                      />
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
                      />
                    )}
                  </Field>
                </Grid>
                <Grid xs={24} justify="center">
                  <Button htmlType="submit">
                    {isWalletConnected ? 'Swap' : 'Need to connect wallet'}
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
