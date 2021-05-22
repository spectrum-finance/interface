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
import { fromAddress } from 'ergo-dex-sdk/src/wallet/entities/publicKey';

interface Swap {
  isWalletConnected: boolean;
}

const getPoolByPair = (tokenId1: any, tokenId2: any) => {
  return {
    id: '12',
    x: [],
    y: [],
  };
};

export const Swap = ({ isWalletConnected }: Swap) => {
  const [addresses, setAddresses] = useState([]);
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
      ergo.get_used_addresses().then((data) => setAddresses(data));
    }
  }, [isWalletConnected]);

  const onSubmit = (values: any) => {
    if (isWalletConnected) {
      const pk = fromAddress(values.address);
      console.log(pk);
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
