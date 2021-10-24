// import { AmmPool, minValueForOrder } from '@ergolabs/ergo-dex-sdk';
// import {
//   AssetAmount,
//   BoxSelection,
//   DefaultBoxSelector,
//   ErgoBox,
//   ergoBoxFromProxy,
//   ergoTxToProxy,
//   publicKeyFromAddress,
// } from '@ergolabs/ergo-sdk';
// import { reverse } from 'ramda';
import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Field, FieldRenderProps, Form } from 'react-final-form';
//
// import { ERG_DECIMALS, UI_FEE } from '../../constants/erg';
// import { DexFeeDefault } from '../../constants/settings';
// import { useSettings, WalletContext } from '../../context';
// import { useGetAvailablePoolsByLPTokens } from '../../hooks/useGetAvailablePoolsByLPTokens';
// import explorer from '../../services/explorer';
// import { poolActions } from '../../services/poolActions';
// import { makeTarget } from '../../utils/ammMath';
// import { parseUserInputToFractions, renderFractions } from '../../utils/math';
// import { calculateTotalFee } from '../../utils/transactions';
// import { calculateAvailableAmount } from '../../utils/walletMath';
// import { getButtonState } from './buttonState';
// import { RedeemSummary } from './RedeemSummary';
//
// export const Redeem = (): JSX.Element => {
//   const [{ minerFee, address: chosenAddress }] = useSettings();
//   const [exFee] = useState<number>(DexFeeDefault);
//
//   const { isWalletConnected, ergBalance } = useContext(WalletContext);
//   const [amount, setAmount] = useState('');
//   const [LPTokensBalance, setLPTokensBalance] = useState<string | undefined>();
//   const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
//
//   const totalFee = calculateTotalFee(
//     [minerFee, String(exFee), renderFractions(UI_FEE, ERG_DECIMALS)],
//     ERG_DECIMALS,
//   );
//
//   const [utxos, setUtxos] = useState<ErgoBox[]>([]);
//   const availablePools = useGetAvailablePoolsByLPTokens(utxos);
//   const assetsAmountByLPAmount = useMemo(() => {
//     if (!selectedPool || !amount) {
//       return [];
//     }
//
//     return selectedPool.shares(
//       new AssetAmount(selectedPool.lp.asset, parseUserInputToFractions(amount)),
//     );
//   }, [selectedPool, amount]);
//
//   useEffect(() => {
//     if (isWalletConnected && selectedPool) {
//       ergo.get_balance(selectedPool.lp.asset.id).then(setLPTokensBalance);
//     }
//   }, [isWalletConnected, selectedPool]);
//
//   const buttonState = getButtonState({
//     isWalletConnected,
//     selectedPool,
//     amount,
//     ergBalance,
//     exFee,
//     minerFee,
//     LPTokensBalance,
//   });
//
//   useEffect(() => {
//     if (isWalletConnected) {
//       ergo
//         .get_utxos()
//         .then((bs) => (bs ? bs.map((b) => ergoBoxFromProxy(b)) : bs))
//         .then((data) => setUtxos(data ?? []));
//     }
//   }, [isWalletConnected]);
//
//   const onSubmit = async () => {
//     if (isWalletConnected && selectedPool && chosenAddress) {
//       const network = explorer;
//       const poolId = selectedPool.id;
//
//       const pk = publicKeyFromAddress(chosenAddress) as string;
//
//       const actions = poolActions(selectedPool);
//
//       const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);
//       const exFeeNErgs = parseUserInputToFractions(String(exFee), ERG_DECIMALS);
//
//       const minNErgs = minValueForOrder(minerFeeNErgs, UI_FEE, exFeeNErgs);
//       const inputLP = selectedPool.lp.withAmount(BigInt(amount));
//       const target = makeTarget([inputLP], minNErgs);
//
//       actions
//         .redeem(
//           {
//             pk,
//             poolId,
//             exFee: exFeeNErgs,
//             uiFee: UI_FEE,
//             lp: inputLP,
//           },
//           {
//             inputs: DefaultBoxSelector.select(utxos, target) as BoxSelection,
//             changeAddress: chosenAddress,
//             selfAddress: chosenAddress,
//             feeNErgs: parseUserInputToFractions(minerFee, ERG_DECIMALS),
//             network: await network.getNetworkContext(),
//           },
//         )
//         .then(async (tx) => {
//           const txId = await ergo.submit_tx(ergoTxToProxy(tx));
//           toast.success(`Transaction submitted: ${txId} `);
//         })
//         .catch((er) => toast.error(JSON.stringify(er)));
//     }
//   };
//
//   if (!isWalletConnected) {
//     return (
//       <Card>
//         <Text h6>Wallet not connected</Text>
//       </Card>
//     );
//   }
//
//   if (availablePools === null) {
//     return (
//       <Card>
//         <Loading>Fetching available pools</Loading>
//       </Card>
//     );
//   }
//
//   if (availablePools?.length === 0) {
//     return (
//       <Card>
//         <b>No available pools to redeem</b>
//       </Card>
//     );
//   }
//   const outputAssetXName =
//     selectedPool?.assetX.name || selectedPool?.assetX.id.slice(0, 4);
//   const outputAssetYName =
//     selectedPool?.assetY.name || selectedPool?.assetY.id.slice(0, 4);
//
//   const [outputAssetXAmount, outputAssetYAmount] =
//     assetsAmountByLPAmount[0]?.asset.id === selectedPool?.assetX.id
//       ? assetsAmountByLPAmount
//       : reverse(assetsAmountByLPAmount);
//
//   return (
//     <>
//       <Card>
//         <Form
//           onSubmit={onSubmit}
//           initialValues={{
//             amount: '0',
//             address: '',
//           }}
//           render={({ handleSubmit, errors = {} }) => {
//             const isFormDisabled =
//               buttonState.isDisabled || Object.values(errors).length > 0;
//             return (
//               <form onSubmit={handleSubmit}>
//                 <Grid.Container gap={1}>
//                   <Grid xs={24}>
//                     <Text h5>Pool</Text>
//                   </Grid>
//                   <Grid xs={24}>
//                     <Field name="pool" component="select">
//                       {(props: FieldRenderProps<string>) => (
//                         <Select
//                           placeholder="Choose the pool"
//                           width="100%"
//                           {...props.input}
//                           onChange={(value) => {
//                             setSelectedPool(availablePools[Number(value)]);
//                             props.input.onChange(value);
//                           }}
//                         >
//                           {availablePools.map((pool: AmmPool, index) => (
//                             <Select.Option key={pool.id} value={String(index)}>
//                               {pool.assetX.name || pool.assetX.id.slice(0, 4)}/
//                               {pool.assetY.name || pool.assetY.id.slice(0, 4)}
//                             </Select.Option>
//                           ))}
//                         </Select>
//                       )}
//                     </Field>
//                   </Grid>
//                   <Grid xs={24}>
//                     <Text h5>Amount</Text>
//                   </Grid>
//                   <Grid xs={24}>
//                     {selectedPool && (
//                       <Text small={true} type={'secondary'}>
//                         {'Available: ' +
//                           calculateAvailableAmount(
//                             selectedPool?.lp.asset.id,
//                             utxos,
//                           ) +
//                           ' LP'}
//                       </Text>
//                     )}
//                   </Grid>
//                   <Grid xs={24}>
//                     <Field name="amount">
//                       {(props: FieldRenderProps<string>) => (
//                         <Input
//                           placeholder="0.0"
//                           width="100%"
//                           {...props.input}
//                           disabled={!selectedPool}
//                           value={amount}
//                           onKeyPress={(event) => {
//                             // TODO: replace magic numbers with named constants
//                             return event.charCode >= 48 && event.charCode <= 57;
//                           }}
//                           onChange={({ currentTarget }) => {
//                             // TODO: add positive integer validation
//                             try {
//                               if (
//                                 !Number.isInteger(Number(currentTarget.value))
//                               ) {
//                                 return;
//                               }
//
//                               const value = currentTarget.value;
//                               setAmount(value);
//                               props.input.onChange(value);
//                             } catch (e) {
//                               console.error('Redeem amount validaiton failed');
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                   </Grid>
//                   {!isFormDisabled && (
//                     <Grid xs={24} alignItems="flex-start" direction="column">
//                       <Text h5>Redeem summary</Text>
//                       <RedeemSummary
//                         outputAssetXName={outputAssetXName ?? ''}
//                         outputAssetYName={outputAssetYName ?? ''}
//                         outputAssetXAmount={renderFractions(
//                           outputAssetXAmount.amount,
//                           outputAssetXAmount.asset.decimals,
//                         )}
//                         outputAssetYAmount={renderFractions(
//                           outputAssetYAmount.amount,
//                           outputAssetYAmount.asset.decimals,
//                         )}
//                         minerFee={minerFee}
//                         dexFee={String(exFee)}
//                         totalFee={totalFee}
//                       />
//                     </Grid>
//                   )}
//                   <Grid xs={24} justify="center">
//                     <Button
//                       htmlType="submit"
//                       disabled={
//                         buttonState.isDisabled ||
//                         Object.values(errors).length > 0
//                       }
//                     >
//                       {buttonState.text}
//                     </Button>
//                   </Grid>
//                 </Grid.Container>
//               </form>
//             );
//           }}
//         />
//       </Card>
//     </>
//   );
// };
