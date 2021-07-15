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
  Row,
  Select,
  Tag,
  Text,
  Tooltip,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { evaluate } from 'mathjs';
import { AmmPool, Explorer, T2tPoolOps } from 'ergo-dex-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
  ErgoBox,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { YoroiProver } from '../../utils/yoroiProver';
import { WalletContext } from '../../context/WalletContext';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import { defaultMinerFee, nanoErgInErg } from '../../constants/erg';
import { getButtonState } from './utils';
import { validateInputAmount, validateSwapForm } from './validators';
import { useSettings } from '../../context/SettingsContext';
import { SlippageInput } from '../Settings/SlippageInput';
import { toast } from 'react-toastify';

const content = {
  slippage: {
    label: 'Slippage tolerance',
    tooltip:
      'Your transaction will revert if the price changes unfavorably by more than this percentage.',
  },
};

interface SwapFormProps {
  pools: AmmPool[];
}

const calculateAvailableAmount = (
  tokenId: string,
  boxes: ErgoBox[],
): number => {
  return boxes
    .flatMap(({ assets }) => assets)
    .filter((a) => a.tokenId == tokenId)
    .map(({ amount }) => amount)
    .reduce((acc, x) => acc + x, 0);
};

const SwapForm: React.FC<SwapFormProps> = ({ pools }) => {
  const { isWalletConnected, utxos } = useContext(WalletContext);
  const [{ minerFee, address: choosedAddress }] = useSettings();
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
  const [inputAssetAmount, setInputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [outputAssetAmount, setOutputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [slippage, setSlippage] = useState(0.01);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [availableInputAmount, setAvailableInputAmount] = useState(0);
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
  }, [pools, selectedPool, updateSelectedPool]);

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
    if (isWalletConnected && inputAssetAmount) {
      if (utxos) {
        setAvailableInputAmount(
          calculateAvailableAmount(inputAssetAmount.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, inputAssetAmount, utxos]);

  const updateOutputAmountAndFee = useCallback(
    (
      inputAmount: string,
      outputAssetAmount: AssetAmount | undefined,
      inputAssetAmount: AssetAmount | undefined,
    ) => {
      if (
        selectedPool &&
        inputAssetAmount &&
        outputAssetAmount &&
        Number(inputAmount) > 0
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
    [selectedPool],
  );

  const handleSwitchAssets = useCallback(() => {
    setInputAssetAmount(outputAssetAmount);
    setOutputAssetAmount(inputAssetAmount);
    updateOutputAmountAndFee(inputAmount, outputAssetAmount, inputAssetAmount);
  }, [
    inputAssetAmount,
    outputAssetAmount,
    inputAmount,
    updateOutputAmountAndFee,
  ]);

  const handleEnterInputTokenAmount = (value: string) => {
    setInputAmount(value);
    updateOutputAmountAndFee(value, outputAssetAmount, inputAssetAmount);

    if (!value.trim()) {
      setOutputAmount('0');
      setFeePerToken('');
    }
  };

  const handleFormSubmit = async () => {
    if (
      isWalletConnected &&
      selectedPool &&
      inputAssetAmount &&
      outputAssetAmount &&
      utxos?.length &&
      choosedAddress
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
      const pk = fromAddress(choosedAddress) as string;
      const minQuoteOutput = selectedPool.outputAmount(
        baseInput,
        Number(slippage),
      ).amount;
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
                `${
                  Number(minerFee) * nanoErgInErg
                }+(${outputAmount} * ${feePerToken})`,
              ),
              assets: [
                {
                  tokenId: inputAssetAmount.asset.id,
                  amount: baseInputAmount,
                },
              ],
            }) as BoxSelection,
            changeAddress: choosedAddress,
            selfAddress: choosedAddress,
            feeNErgs: BigInt(nanoErgInErg * Number(minerFee)),
            network: await network.getNetworkContext(),
          },
        )
        .then(async (txId) => {
          await ergo.submit_tx(txId);
          toast.success(`Transaction submitted: ${txId} `);
        })
        .catch((er) => toast.error(JSON.stringify(er)));
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={{
        slippage,
        inputAmount: 0.0,
        outputAmount: 0.0,
        address: '',
        poolId: undefined,
        feePerToken: 0,
      }}
      validate={() => {
        if (buttonStatus.disabled || !isWalletConnected) return;
        const errorMsg = validateSwapForm(
          { inputAmount },
          { availableInputAmount },
        );

        if (errorMsg) {
          return { [FORM_ERROR]: errorMsg };
        }
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
            <Grid xs={24} direction="column">
              <Field
                name="inputAmount"
                validate={(value) => {
                  return validateInputAmount(value, {
                    maxDecimals: inputAssetAmount?.asset.decimals || 0,
                  });
                }}
              >
                {(props: FieldRenderProps<string>) => (
                  <>
                    <Row>
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
                    </Row>
                    {props.meta.error && (
                      <Row>
                        <Text p small type="error">
                          {props.meta.error}
                        </Text>
                      </Row>
                    )}
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
              <Text h4>
                {content.slippage.label}{' '}
                <Tooltip text={content.slippage.tooltip}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tooltip>
              </Text>
            </Grid>
            <Grid xs={24}>
              <SlippageInput slippage={slippage} setSlippage={setSlippage} />
            </Grid>
            <Grid xs={24}>
              <Text h4>Fee per token</Text>
            </Grid>
            <Grid xs={24}>
              <Field
                name="feePerToken"
                validate={(value) => {
                  return validateInputAmount(value, {
                    maxDecimals: inputAssetAmount?.asset.decimals || 0,
                  });
                }}
              >
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
            <Grid xs={24} direction="column">
              {errors[FORM_ERROR] && (
                <Row>
                  <Text p small type="error">
                    {errors[FORM_ERROR]}
                  </Text>
                </Row>
              )}
              <Row justify="center">
                <Button
                  htmlType="submit"
                  disabled={
                    buttonStatus.disabled || Object.values(errors).length > 0
                  }
                >
                  {buttonStatus.text}
                </Button>
              </Row>
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
