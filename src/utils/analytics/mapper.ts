import {
  AmmPoolProps,
  DepositProps,
  FarmProps,
  OperationSettingsProps,
  RedeemProps,
  SwapProps,
  TokenProps,
} from '@spectrumlabs/analytics';
import { add } from 'mathjs';

import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { Currency } from '../../common/models/Currency';
import { Farm } from '../../common/models/Farm.ts';
import { AddLiquidityFormModel } from '../../components/AddLiquidityForm/AddLiquidityFormModel';
import { EventProducerContext } from '../../gateway/analytics/fireOperationAnalyticsEvent';
import { Network } from '../../network/common/Network';
import { Stake } from '../../network/ergo/lm/models/Stake.ts';
import { StakeFormModel } from '../../network/ergo/lm/operations/lmDeposit/LmDepositModalContent/LmDepositModalContent.tsx';
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

export const mapToTokenProps = (token: AssetInfo): TokenProps => ({
  toke_id: token.id,
  token_name: setString(token.ticker),
});

export const mapToAmmPoolAnalyticsProps = (pool?: AmmPool): AmmPoolProps => ({
  amm_pool_fee: pool?.poolFee || 0,
  amm_pool_id: setString(pool?.id),
  amm_pool_name: getPoolName(pool),

  // Dividing by 100 to get real USD value
  amm_pool_tvl: Number(pool?.tvl?.amount) / 100,
});

const setString = (s?: string): string => s || 'null';

export const mapToSwapAnalyticsProps = (
  value: SwapFormModel,
  { network, ...rest }: EventProducerContext,
): SwapProps => {
  return {
    network: network.name,

    from_name: setString(value.fromAsset?.ticker),
    from_amount: Number(value.fromAmount?.toAmount()),
    from_usd: toUsd(network, value.fromAmount),
    from_id: setString(value.fromAsset?.id),
    to_name: setString(value.toAsset?.ticker),
    to_amount: Number(value.toAmount?.toAmount()),
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
    x_amount: Number(value.x?.toAmount()),
    x_usd: toUsd(network, value.x),
    y_name: setString(value.y?.asset.ticker),
    y_amount: Number(value.y?.toAmount()),
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
    x_amount: Number(value.xAmount?.toAmount()),
    x_usd: toUsd(network, value.xAmount),
    y_name: setString(value.yAmount?.asset.ticker),
    y_amount: Number(value.yAmount?.toAmount()),
    y_usd: toUsd(network, value.yAmount),
    lp_usd: toUsdLq(network, value.xAmount, value.yAmount),
    percent_of_liquidity: value.percent,

    ...getOperationSettingsProps(rest),

    ...mapToAmmPoolAnalyticsProps(pool),
  };
};

export const mapToFarmAnalyticsProps = (
  farm: Farm,
  { network }: EventProducerContext,
): FarmProps => {
  return {
    farm_id: farm.id,
    farm_status: farm.status,
    farm_name: getPoolName(farm.ammPool),
    farm_reward_asset_id: farm.reward.asset.id,
    farm_reward_asset_name: setString(farm.reward.asset.ticker),
    farm_total_staked_x: Number(farm.totalStakedX?.toAmount()),
    farm_total_staked_y: Number(farm.totalStakedY?.toAmount()),
    farm_total_staked_usd: add(
      toUsd(network, farm.totalStakedX),
      toUsd(network, farm.totalStakedY),
    ),
    farm_apr: farm.apr ? farm.apr : 0,
    farm_user_staked_x: Number(farm.yourStakeX),
    farm_user_staked_y: Number(farm.yourStakeY),
    farm_user_available_x: Number(farm.availableToStakeX),
    farm_user_available_y: Number(farm.availableToStakeY),

    ...mapToAmmPoolAnalyticsProps(farm.ammPool),
  };
};

export const mapToStakeAnalyticsProps = (
  form: StakeFormModel,
  farm: Farm,
  eventProducerContext,
) => {
  return {
    stake_x_amount: Number(form.xAmount.toAmount()),
    stake_y_amount: Number(form.yAmount.toAmount()),
    ...mapToFarmAnalyticsProps(farm, eventProducerContext),
  };
};

export const mapToUnstakeAnalyticsProps = (
  stake: Stake,
  farm: Farm,
  eventProducerContext,
) => {
  return {
    stake_x_amount: Number(stake.x.toAmount()),
    stake_y_amount: Number(stake.y.toAmount()),
    ...mapToFarmAnalyticsProps(farm, eventProducerContext),
  };
};
