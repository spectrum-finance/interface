import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Grid,
  Input,
  Select,
  Text,
} from '@geist-ui/react';
import { Field, FieldRenderProps, Form } from 'react-final-form';
import { getListAvailableTokens } from '../../utils/getListAvailableTokens';
import {
  make,
  PoolSetupParams,
} from 'ergo-dex-sdk/build/module/amm/models/poolSetupParams';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
  ErgoTx,
  Input as TxInput,
  Prover,
  UnsignedErgoTx,
} from 'ergo-dex-sdk/build/module/ergo';
import { TransactionContext } from 'ergo-dex-sdk/build/module/ergo';
import { Explorer, Pools, RustModule, T2tPoolOps } from 'ergo-dex-sdk';

interface CreateLiquidity {
  isWalletConnected: boolean;
}

class YoroiProver implements Prover {
  /** Sign the given transaction.
   */
  sign(tx: UnsignedErgoTx): Promise<ErgoTx> {
    return ergo.sign_tx(tx);
  }
  /** Sign particular input of the given transaction.
   */
  signInput(tx: UnsignedErgoTx, input: number): Promise<TxInput> {
    return ergo.sign_tx_input(tx, input);
  }
}

const initialState = {
  address: '',
  firstTokenId: '',
  firstTokenAmount: '',
  secondTokenId: '',
  secondTokenAmount: '',
  fee: 1,
  lockNanoErgs: '100000',
};

export const CreateLiquidity = ({ isWalletConnected }: CreateLiquidity) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [utxos, setUtxos] = useState([]);
  const currencies = [
    { label: 'ETH', value: 'ETH' },
    { label: 'ERG', value: 'ERG' },
  ];

  const listAvailableTokens = useMemo(() => getListAvailableTokens(utxos), []);

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => setAddresses(data));
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  const onCreateLiquidity = useCallback(async () => {
    if (isWalletConnected) {
      await RustModule.load();
      const network = new Explorer('https://api.ergoplatform.com');
      const newPair = make(
        new AssetAmount(
          {
            id: '003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0',
          },
          100n,
        ),
        new AssetAmount(
          {
            id: '231f4e245473c21777186ce97acd8279aa7c9fa3f3418504525a4a86478ac6f5',
          },
          150n,
        ),
        0.25,
        1000000n,
      ) as PoolSetupParams;

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      poolOps
        .setup(newPair, {
          inputs: DefaultBoxSelector.select(utxos, {
            nErgs: 50000000,
            assets: [
              {
                tokenId:
                  '231f4e245473c21777186ce97acd8279aa7c9fa3f3418504525a4a86478ac6f5',
                amount: 1500,
              },
              {
                tokenId:
                  '003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0',
                amount: 200,
              },
            ],
          }) as BoxSelection,
          changeAddress: '9g9cdHhNZvtUvMveqEEfk28JZasEC8sJamV3E6d5JHv8VYUjjbX',
          selfAddress: '9g9cdHhNZvtUvMveqEEfk28JZasEC8sJamV3E6d5JHv8VYUjjbX',
          feeNErgs: 10000000n,
          network: await network.getNetworkContext(),
        })
        .then((d: any) => console.log(12, d))
        .catch((er) => console.log(13, er));
      //
    }
    console.log(isWalletConnected);
  }, [isWalletConnected, utxos, addresses]);

  if (!isWalletConnected) {
    return <Card>Need connect wallet</Card>;
  }

  console.log(utxos, getListAvailableTokens(utxos));

  return (
    <>
      <Card>
        <Form
          onSubmit={onCreateLiquidity}
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
                  <Text h4>1 asset</Text>
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
                  <Text h4>2 asset</Text>
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
                <Grid xs={24}>
                  <Text h4>Fee</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="fee">
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
                  <Text h4>Lock ergs in pool</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="lockNanoErgs">
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
