import {
  AmmPoolProps,
  DepositProps,
  OperationSettingsProps,
  RedeemProps,
  SwapProps,
} from '@spectrumlabs/analytics';

import { AmmPool } from '../../common/models/AmmPool';
import { Currency } from '../../common/models/Currency';
import { EventProducerContext } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { Network } from '../../network/common/Network';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { RemoveLiquidityFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';

const toUsd = (network: Network<any, any>, asset?: Currency) =>
  asset
    ? Number(network.convertToConvenientNetworkAsset.snapshot(asset).toAmount())
    : 0;

const toUsdLq = (network: Network<any, any>, x?: Currency, y?: Currency) =>
  x && y ? toUsd(network, x) + toUsd(network, y) : 0;

const getPoolName = (pool?: AmmPool) =>
  `${pool?.x.asset.ticker}/${pool?.y.asset.ticker}`;

const getOperationSettingsProps = ({
  feeCurrency,
  nitro,
  slippage,
}: Partial<EventProducerContext>): OperationSettingsProps => ({
  settings_fee_currency: feeCurrency!,
  settings_nitro: nitro!,
  settings_slippage: slippage!,
});

export const mapToAmmPoolAnalyticsProps = (pool?: AmmPool): AmmPoolProps => ({
  amm_pool_fee: pool?.poolFee || 0,
  amm_pool_id: setString(pool?.id),
  amm_pool_name: getPoolName(pool),

  // Dividing by 100 to get real USD value
  amm_pool_tvl: Number(pool?.tvl?.value) / 100,
});

const setString = (s?: string) => s || 'null';

export const mapToSwapAnalyticsProps = (
  value: SwapFormModel,
  { network, ...rest }: EventProducerContext,
): SwapProps => {
  return {
    network: network.name,

    from_name: setString(value.fromAsset?.ticker),
    from_amount: Number(value.fromAmount?.toString()),
    from_usd: toUsd(network, value.fromAmount),
    from_id: setString(value.fromAsset?.id),
    to_name: setString(value.toAsset?.ticker),
    to_amount: Number(value.toAmount?.toString()),
    to_usd: toUsd(network, value.toAmount),
    to_id: setString(value.toAsset?.id),

    ...getOperationSettingsProps(rest),

    ...mapToAmmPoolAnalyticsProps(value.pool),
  };
};

export const mapToDepositAnalyticsProps = (
  value: AddLiquidityFormModel,
  { network, ...rest }: EventProducerContext,
): DepositProps => {
  return {
    network: network.name,

    x_name: setString(value.x?.asset.ticker),
    x_amount: Number(value.x?.toString()),
    x_usd: toUsd(network, value.x),
    y_name: setString(value.y?.asset.ticker),
    y_amount: Number(value.y?.toString()),
    y_usd: toUsd(network, value.y),
    lp_usd: toUsdLq(network, value.x, value.y),

    ...getOperationSettingsProps(rest),

    ...mapToAmmPoolAnalyticsProps(value.pool),
  };
};

export const mapToRedeemAnalyticsProps = (
  value: RemoveLiquidityFormModel,
  pool: AmmPool,
  { network, ...rest }: EventProducerContext,
): RedeemProps => {
  return {
    network: network.name,

    x_name: setString(value.xAmount?.asset.ticker),
    x_amount: Number(value.xAmount?.toString()),
    x_usd: toUsd(network, value.xAmount),
    y_name: setString(value.yAmount?.asset.ticker),
    y_amount: Number(value.yAmount?.toString()),
    y_usd: toUsd(network, value.yAmount),
    lp_usd: toUsdLq(network, value.xAmount, value.yAmount),
    percent_of_liquidity: value.percent,

    ...getOperationSettingsProps(rest),

    ...mapToAmmPoolAnalyticsProps(pool),
  };
};
