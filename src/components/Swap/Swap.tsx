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
import { Explorer, NetworkPools, RustModule } from 'ergo-dex-sdk';
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
      const poolNetwork = new NetworkPools(
        new Explorer('https://api.ergoplatform.com/api/v1'),
      );
      // // выбрать pool из селекта
      const pools = await poolNetwork.getAll({ limit: 100, offset: 0 });
      console.log(pools);
      // const chosenPool = pools[0];
      // const poolScriptHash = chosenPool.poolScriptHash;
      // const yoroiWalletProver = {} as any;
      // const pool = new T2tPoolOps(yoroiWalletProver); // prover
      // const baseInput = chosenPool.x.withAmount(values.firstTokenAmount);
      //
      // const boxes = await ergo.get_utxos(
      //   baseInput.amount.toString(),
      //   baseInput.asset.id,
      // ); // конвертить через boxFromWasm
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
