import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  Button,
  Card,
  Grid,
  Input,
  Loading,
  Select,
  Tag,
  Text,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { evaluate } from 'mathjs';
import { AmmPool, Explorer, T2tPoolOps } from 'ergo-dex-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { YoroiProver } from '../../utils/yoroiProver';
import { WalletContext } from '../../context/WalletContext';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { defaultMinerFee } from '../../constants/erg';
import { getButtonState } from './utils';
import { useSettings } from '../../context/SettingsContext';

interface SwapFormProps {
  pools: AmmPool[];
}

const SwapForm: React.FC<SwapFormProps> = ({ pools }) => {
  const [{ dexFee, slippage, address: choosedAddress }] = useSettings();
  const { isWalletConnected } = useContext(WalletContext);
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
  const [inputAssetAmount, setInputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [outputAssetAmount, setOutputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [feePerToken, setFeePerToken] = useState('');

  const updateSelectedPool = useCallback((pool: AmmPool) => {
    setSelectedPool(pool);
    setInputAssetAmount(pool.x);
    setOutputAssetAmount(pool.y);
  }, []);

  useEffect(() => {
    if (selectedPool === undefined) {
      updateSelectedPool(pools[0]);
    }
  }, [pools]);

  const [addresses, setAddresses] = useState<string[]>([]);
  const [utxos, setUtxos] = useState([]);

  const buttonStatus = useMemo(
    () =>
      getButtonState({
        isWalletConnected,
        inputAssetId: inputAssetAmount?.asset.id,
        outputAssetId: outputAssetAmount?.asset.id,
        inputAmount,
        outputAmount,
        choosedAddress,
        utxos,
      }),
    [
      isWalletConnected,
      inputAmount,
      outputAmount,
      inputAssetAmount,
      outputAssetAmount,
      choosedAddress,
      utxos,
    ],
  );

  useEffect(() => {
    if (isWalletConnected) {
      ergo.get_used_addresses().then((data: string[]) => {
        setAddresses(data);
        setSelectedAddress(data[0]);
      });
      ergo.get_utxos().then((data: any) => setUtxos(data));
    }
  }, [isWalletConnected]);

  const updateOutputAmountAndFee = useCallback(
    (inputAmount) => {
      if (
        selectedPool &&
        inputAssetAmount &&
        outputAssetAmount &&
        inputAmount > 0
      ) {
        const amount = selectedPool.outputAmount(
          new AssetAmount(
            inputAssetAmount.asset,
            BigInt(
              evaluate(
                `${inputAmount}*10^${inputAssetAmount.asset.decimals ?? 0}`,
              ).toFixed(0),
            ),
          ),
          1,
        );
        const feePerToken = Math.ceil(
          evaluate(
            `${defaultMinerFee} / (${amount?.amount}/10^${
              outputAssetAmount.asset.decimals || 0
            })`,
          ),
        ).toFixed(0);
        setFeePerToken(feePerToken);
        setOutputAmount(
          String(
            evaluate(
              `${amount?.amount}/10^${outputAssetAmount.asset.decimals ?? 0}`,
            ),
          ),
        );
      }
    },
    [selectedPool, inputAssetAmount, outputAssetAmount],
  );

  const handleSwitchAssets = useCallback(() => {
    setInputAssetAmount(outputAssetAmount);
    setOutputAssetAmount(inputAssetAmount);
    updateOutputAmountAndFee(inputAmount);
  }, [
    inputAssetAmount,
    outputAssetAmount,
    inputAmount,
    updateOutputAmountAndFee,
  ]);

  const handleEnterInputTokenAmount = (value: any) => {
    setInputAmount(value);
    updateOutputAmountAndFee(value);

    if (!value.trim()) {
      setOutputAmount('0');
      setFeePerToken('');
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (
      isWalletConnected &&
      selectedPool &&
      inputAssetAmount &&
      outputAssetAmount
    ) {
      const network = new Explorer('https://api.ergoplatform.com');
      const poolId = selectedPool.id;

      const baseInputAmount = evaluate(
        `(${inputAmount} * 10^${inputAssetAmount.asset.decimals || 0})`,
      ).toFixed(0);
      const baseInput = selectedPool.x.withAmount(BigInt(baseInputAmount));

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(selectedAddress) as string;
      const minQuoteOutput = selectedPool.outputAmount(baseInput, 1).amount;
      const dexFeePerToken = Number(feePerToken);
      const poolFeeNum = selectedPool.poolFeeNum;

      poolOps
        .swap(
          {
            pk,
            poolId,
            baseInput,
            minQuoteOutput,
            dexFeePerToken,
            quoteAsset: outputAssetAmount.asset.id,
            poolFeeNum,
          },
          {
            inputs: DefaultBoxSelector.select(utxos, {
              nErgs: evaluate(
                `${defaultMinerFee}+(${outputAmount} * ${feePerToken})`,
              ),
              assets: [
                {
                  tokenId: inputAssetAmount.asset.id,
                  amount: baseInputAmount,
                },
              ],
            }) as BoxSelection,
            changeAddress: selectedAddress,
            selfAddress: selectedAddress,
            feeNErgs: BigInt(defaultMinerFee),
            network: await network.getNetworkContext(),
          },
        )
        .then((d: any) => {
          ergo.submit_tx(d);
          alert(`Transaction submitted: ${d} `);
        })
        .catch((er) => console.log(13, er));
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={{
        slippage: 1,
        inputAmount: 0.0,
        outputAmount: 0.0,
        address: '',
        poolId: undefined,
        feePerToken: 0,
      }}
      render={({ handleSubmit, errors = {} }) => (
        <form onSubmit={handleSubmit}>
          <Grid.Container gap={1}>
            <Grid xs={24}>
              <Text h4>Pool</Text>
            </Grid>
            <Grid xs={24}>
              <Field name="poolId" component="select">
                {(props: FieldRenderProps<string>) => (
                  <PoolSelect
                    pools={pools}
                    value={selectedPool}
                    onChangeValue={updateSelectedPool}
                    inputProps={props.input}
                  />
                )}
              </Field>
            </Grid>
            <Grid xs={24}>
              <Text h4>From</Text>
            </Grid>
            <Grid xs={24}>
              <Field
                name="inputAmount"
                validate={(value) => {
                  if (!value || !value.trim()) {
                    return;
                  }
                  const comma = value.match('[,.]');
                  if (comma && !inputAssetAmount?.asset.decimals) {
                    return 'No decimals at this token after comma';
                  }

                  if (
                    comma &&
                    value.substr(comma.index + 1) >
                      (inputAssetAmount?.asset.decimals || 0)
                  ) {
                    return `Max decimals at this token after comma is ${
                      inputAssetAmount?.asset.decimals || 0
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
                      label={inputAssetAmount?.asset.name ?? ''}
                      {...props.input}
                      disabled={!inputAssetAmount}
                      value={inputAmount}
                      onChange={({ currentTarget }) => {
                        const value = currentTarget.value;
                        handleEnterInputTokenAmount(value);
                        props.input.onChange(value);
                      }}
                    />
                    {props.meta.error && <p>{props.meta.error}</p>}
                  </>
                )}
              </Field>
            </Grid>
            <Grid xs={24} justify="center">
              <Tag
                onClick={handleSwitchAssets}
                type="success"
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faExchangeAlt} />
              </Tag>
            </Grid>
            <Grid xs={24}>
              <Text h4>To</Text>
            </Grid>
            <Grid xs={24}>
              <Field name="outputAmount">
                {(props: FieldRenderProps<string>) => (
                  <Input
                    placeholder="0.0"
                    type="number"
                    label={outputAssetAmount?.asset.name ?? ''}
                    width="100%"
                    {...props.input}
                    value={outputAmount}
                    onChange={(e) => {
                      props.input.onChange(e.currentTarget.value);
                    }}
                    disabled
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
                    disabled={!outputAmount}
                    value={feePerToken}
                    onChange={({ currentTarget }) => {
                      setFeePerToken(currentTarget.value as string);
                      props.input.onChange(currentTarget.value);
                    }}
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
  );
};

export const Swap: React.FC = (props) => {
  const pools = useGetAllPools();
  if (pools === undefined) {
    return (
      <Card>
        <Loading>Loading</Loading>
      </Card>
    );
  }

  return <SwapForm pools={pools} {...props} />;
};
