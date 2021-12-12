/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain,react-hooks/exhaustive-deps */
import './AddLiquidity.less';

import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import React from 'react';
import { of } from 'rxjs';

import { TokenControlValue } from '../../../components/common/TokenControl/TokenControl';
import { FormPageWrapper } from '../../../components/FormPageWrapper/FormPageWrapper';
import { getAvailableAssetFor } from '../../../services/new/assets';
import { getPoolByPair } from '../../../services/new/pools';

interface AddLiquidityFormModel {
  readonly x?: TokenControlValue['asset'];
  readonly y?: TokenControlValue['asset'];
  readonly xAmount?: TokenControlValue;
  readonly yAmount?: TokenControlValue;
  readonly activePool?: AmmPool;
}

// class AddLiquidityStrategy implements ActionFormStrategy {
//   constructor(private balance: Balance, private minerFee: number) {}
//
//   actionButtonCaption(): React.ReactNode {
//     return 'Add liquidity';
//   }
//
//   getInsufficientTokenForFee(
//     form: FormInstance<AddLiquidityFormModel>,
//   ): string | undefined {
//     const { xAmount } = form.getFieldsValue();
//
//     let totalFees = +calculateTotalFee(
//       [this.minerFee, UI_FEE, defaultExFee],
//       ERG_DECIMALS,
//     );
//
//     totalFees =
//       xAmount?.asset?.id === ERG_TOKEN_ID
//         ? totalFees + xAmount.amount?.value!
//         : totalFees;
//
//     return +totalFees > this.balance.get(ERG_TOKEN_ID)
//       ? ERG_TOKEN_NAME
//       : undefined;
//   }
//
//   getInsufficientTokenForTx(
//     form: FormInstance<AddLiquidityFormModel>,
//   ): Observable<string | undefined> | string | undefined {
//     const { x, y, xAmount, yAmount } = form.getFieldsValue();
//     const xAmountValue = xAmount?.amount?.value;
//     const yAmountValue = yAmount?.amount?.value;
//
//     if (
//       x &&
//       xAmount &&
//       xAmount?.asset &&
//       xAmountValue! > this.balance.get(xAmount?.asset?.id)
//     ) {
//       return x?.name;
//     }
//
//     if (
//       y &&
//       yAmount &&
//       yAmount?.asset &&
//       yAmountValue! > this.balance.get(yAmount?.asset?.id)
//     ) {
//       return y?.name;
//     }
//
//     return undefined;
//   }
//
//   isAmountNotEntered(form: FormInstance<AddLiquidityFormModel>): boolean {
//     const value = form.getFieldsValue();
//
//     return !value.xAmount?.amount?.value || !value.yAmount?.amount?.value;
//   }
//
//   isTokensNotSelected(form: FormInstance<AddLiquidityFormModel>): boolean {
//     const value = form.getFieldsValue();
//
//     return !value.activePool;
//   }
//
//   request(form: FormInstance<AddLiquidityFormModel>): void {
//     const value = form.getFieldsValue();
//
//     openConfirmationModal(
//       (next) => {
//         return (
//           <AddLiquidityConfirmationModal
//             position={value.activePool}
//             pair={{
//               assetX: {
//                 name: value.xAmount?.asset?.name,
//                 amount: value.xAmount?.amount?.value,
//               },
//               assetY: {
//                 name: value.yAmount?.asset?.name,
//                 amount: value.yAmount?.amount?.value,
//               },
//             }}
//             onClose={next}
//           />
//         );
//       },
//       Operation.ADD_LIQUIDITY,
//       { asset: value.x!, amount: value?.xAmount?.amount?.value! },
//       { asset: value.y!, amount: value?.yAmount?.amount?.value! },
//     );
//   }
//
//   isLiquidityInsufficient(): boolean {
//     return false;
//   }
// }

const initialValues: AddLiquidityFormModel = {
  x: {
    name: 'ERG',
    id: '0000000000000000000000000000000000000000000000000000000000000000',
  },
};

const getAssetsByToken = (tokenId?: string) => {
  return tokenId ? getAvailableAssetFor(tokenId) : of([]);
};

const getAvailablePools = (xId?: string, yId?: string) =>
  xId && yId ? getPoolByPair(xId, yId) : of([]);

const AddLiquidity = (): JSX.Element => {
  // const [balance] = useWalletBalance();
  // const [{ minerFee }] = useSettings();
  //
  // const { poolId } = useParams<{ poolId?: PoolId }>();
  //
  // const addLiquidityStrategy = new AddLiquidityStrategy(balance, minerFee);
  // const [form] = Form.useForm<AddLiquidityFormModel>();
  // const [xAssets] = useObservable(assets$);
  // const [yAssets, setYAssets] = useSubject(getAssetsByToken);
  // const [pools, setPools] = useSubject(getAvailablePools);
  // const [poolById, setPoolById] = useSubject(getPoolById);
  //
  // const [isPairSelected, setIsPairSelected] = useState(false);
  //
  // const [isFirstPageLoading, setIsFirstPageLoading] = useState(true);
  //
  // const onValuesChange = (
  //   changes: AddLiquidityFormModel,
  //   value: AddLiquidityFormModel,
  //   prevValue: AddLiquidityFormModel,
  // ) => {
  //   if (value.x?.id !== prevValue.x?.id) {
  //     setYAssets(value?.x?.id);
  //     form.setFieldsValue({
  //       xAmount: undefined,
  //       yAmount: undefined,
  //       activePool: undefined,
  //       y: undefined,
  //     });
  //     setPools();
  //     setIsPairSelected(false);
  //     return;
  //   }
  //
  //   if (value?.activePool) {
  //     if (changes?.xAmount) {
  //       const newYAsset = value.activePool.depositAmount(
  //         new AssetAmount(
  //           changes.xAmount?.asset as AssetInfo,
  //           parseUserInputToFractions(
  //             changes.xAmount?.amount?.value ?? 0,
  //             changes.xAmount?.asset?.decimals,
  //           ),
  //         ),
  //       );
  //
  //       form.setFieldsValue({
  //         yAmount: {
  //           amount: {
  //             viewValue: renderFractions(
  //               newYAsset.amount,
  //               newYAsset.asset.decimals,
  //             ),
  //             value: Number(
  //               renderFractions(newYAsset.amount, newYAsset.asset.decimals),
  //             ),
  //           },
  //         },
  //       });
  //     }
  //
  //     if (changes?.yAmount) {
  //       const newXAsset = value.activePool.depositAmount(
  //         new AssetAmount(
  //           changes.yAmount?.asset as AssetInfo,
  //           parseUserInputToFractions(
  //             changes.yAmount?.amount?.value ?? 0,
  //             changes.yAmount?.asset?.decimals,
  //           ),
  //         ),
  //       );
  //
  //       form.setFieldsValue({
  //         xAmount: {
  //           amount: {
  //             viewValue: renderFractions(
  //               newXAsset.amount,
  //               newXAsset.asset.decimals,
  //             ),
  //             value: Number(
  //               renderFractions(newXAsset.amount, newXAsset.asset.decimals),
  //             ),
  //           },
  //         },
  //       });
  //     }
  //   }
  //
  //   if (changes?.activePool) {
  //     form.setFieldsValue({
  //       xAmount: { asset: changes.activePool.assetX },
  //       yAmount: { asset: changes.activePool.assetY },
  //     });
  //   }
  //
  //   if (value?.x && value?.y) {
  //     setPools(value.x.id, value.y.id);
  //     setIsPairSelected(true);
  //   }
  // };
  //
  // useEffect(() => {
  //   if (isFirstPageLoading && poolById) {
  //     setYAssets(poolById?.x?.asset.id);
  //
  //     setPools(poolById?.x?.asset.id, poolById?.y?.asset.id);
  //
  //     form.setFieldsValue({
  //       activePool: poolById,
  //       x: {
  //         name: poolById?.x.asset.name,
  //         id: poolById?.x.asset.id,
  //       },
  //       y: {
  //         name: poolById?.y.asset.name,
  //         id: poolById?.y.asset.id,
  //       },
  //       xAmount: { asset: poolById?.x.asset },
  //       yAmount: { asset: poolById?.y.asset },
  //     });
  //     setIsFirstPageLoading(false);
  //   } else if (poolId && isFirstPageLoading) {
  //     setPoolById(poolId);
  //   }
  // }, [
  //   form,
  //   isFirstPageLoading,
  //   poolById,
  //   poolId,
  //   setPoolById,
  //   setYAssets,
  //   setPools,
  // ]);
  //
  // useEffect(() => {
  //   if (!poolId) {
  //     setYAssets(initialValues?.x?.id);
  //   }
  // }, []);

  return (
    <FormPageWrapper
      title="Add liquidity"
      width={480}
      withBackButton
      backTo="/pool"
    >
      {/*  {!poolId || (pools && pools.length) ? (*/}
      {/*    <ActionForm*/}
      {/*      form={form}*/}
      {/*      strategy={addLiquidityStrategy}*/}
      {/*      initialValues={initialValues}*/}
      {/*      onValuesChange={onValuesChange}*/}
      {/*    >*/}
      {/*      <Flex direction="col">*/}
      {/*        <Flex.Item marginBottom={4}>*/}
      {/*          <Typography.Body strong>Select Pair</Typography.Body>*/}
      {/*          <Flex justify="center" align="center">*/}
      {/*            <Flex.Item marginRight={2} style={{ width: '100%' }}>*/}
      {/*              <TokeSelectFormItem name="x" assets={xAssets} />*/}
      {/*            </Flex.Item>*/}
      {/*            <Flex.Item style={{ width: '100%' }}>*/}
      {/*              <TokeSelectFormItem name="y" assets={yAssets} />*/}
      {/*            </Flex.Item>*/}
      {/*          </Flex>*/}
      {/*        </Flex.Item>*/}
      {/*        <Flex.Item*/}
      {/*          marginBottom={4}*/}
      {/*          style={{ opacity: isPairSelected ? '' : '0.3' }}*/}
      {/*        >*/}
      {/*          <Typography.Body strong>Select Pool</Typography.Body>*/}
      {/*          <Form.Item name="activePool" style={{ marginBottom: 0 }}>*/}
      {/*            <PoolSelect positions={pools} />*/}
      {/*          </Form.Item>*/}
      {/*        </Flex.Item>*/}
      {/*        <Flex.Item*/}
      {/*          marginBottom={4}*/}
      {/*          style={{ opacity: isPairSelected ? '' : '0.3' }}*/}
      {/*        >*/}
      {/*          <Typography.Body strong>Liquidity</Typography.Body>*/}
      {/*          <Flex direction="col">*/}
      {/*            <Flex.Item marginBottom={2}>*/}
      {/*              <TokenControlFormItem*/}
      {/*                readonly="asset"*/}
      {/*                disabled={!isPairSelected}*/}
      {/*                name="xAmount"*/}
      {/*                assets={xAssets}*/}
      {/*              />*/}
      {/*            </Flex.Item>*/}
      {/*            <Flex.Item>*/}
      {/*              <TokenControlFormItem*/}
      {/*                readonly="asset"*/}
      {/*                disabled={!isPairSelected}*/}
      {/*                name="yAmount"*/}
      {/*                assets={yAssets}*/}
      {/*              />*/}
      {/*            </Flex.Item>*/}
      {/*          </Flex>*/}
      {/*        </Flex.Item>*/}
      {/*      </Flex>*/}
      {/*    </ActionForm>*/}
      {/*  ) : (*/}
      {/*    <Skeleton active />*/}
      {/*  )}*/}
    </FormPageWrapper>
  );
};
export { AddLiquidity };
