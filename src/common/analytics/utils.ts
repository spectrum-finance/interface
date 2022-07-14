import { Network } from '../../network/common/Network';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { RemoveFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidity';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { AmmPool } from '../models/AmmPool';
import { Currency } from '../models/Currency';
import {
  AnalyticsAppOperations,
  AnalyticsDepositData,
  AnalyticsElementLocation,
  AnalyticsPoolData,
  AnalyticsRedeemData,
  AnalyticsSwapData,
  AnalyticsTokenAssignment,
} from './@types/types';

type EventNameConstructorOptions = {
  location?: AnalyticsElementLocation;
  operation?: AnalyticsAppOperations;
  tokenAssignment?: AnalyticsTokenAssignment;
};

const getLiquidityUsd = (
  x: Currency,
  y: Currency,
  network: Network<any, any>,
) =>
  Number(network.convertToConvenientNetworkAsset.snapshot(x).toAmount()) +
  Number(network.convertToConvenientNetworkAsset.snapshot(y).toAmount());

export const getAnalyticsPoolName = (pool: AmmPool): string => {
  return `${pool.pool.x.asset.name}/${pool.pool.y.asset.name}`;
};

export const normalizeEventPart = (str: string): string => {
  let result = '';

  const first = str[0].toUpperCase();

  result = `${first}${str.slice(1)}`;

  return result
    .split('')
    .map((s) => (s === '_' || s === '-' ? ' ' : s))
    .join('');
};

export const constructEventName = (
  eventName: string,
  opt?: EventNameConstructorOptions,
): string => {
  let result = eventName;

  if (opt && opt.operation)
    result = `${normalizeEventPart(opt.operation)} ${result}`;
  if (opt && opt.location)
    result = `${normalizeEventPart(opt.location)} ${result}`;
  if (opt && opt.tokenAssignment)
    result = `${result} "${normalizeEventPart(opt.tokenAssignment)}"`;

  return result;
};

export const getPoolAnalyticsData = (pool: AmmPool): AnalyticsPoolData => {
  return {
    pool_id: pool.id,
    pool_name: getAnalyticsPoolName(pool),
    tvl: Number(pool.tvl?.value) / 100,
    pool_fee: pool.poolFee,
  };
};

export const convertSwapFormModelToAnalytics = (
  { toAmount, fromAmount, pool }: SwapFormModel,
  network: Network<any, any>,
): AnalyticsSwapData & AnalyticsPoolData => {
  return {
    from_name: fromAmount?.asset.name,
    from_amount: Number(fromAmount?.toAmount()),
    from_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(fromAmount!).toAmount(),
    ),
    from_id: fromAmount?.asset.id,

    to_name: toAmount?.asset.name,
    to_amount: Number(toAmount?.toAmount()),
    to_id: toAmount?.asset.id,
    to_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(toAmount!).toAmount(),
    ),
    ...getPoolAnalyticsData(pool!),
  };
};

export const convertDepositFormModelToAnalytics = (
  { x, y, pool }: AddLiquidityFormModel,
  network: Network<any, any>,
): AnalyticsDepositData & AnalyticsPoolData => {
  return {
    x_name: x?.asset.name,
    x_amount: Number(x?.toAmount()),
    x_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(x!).toAmount(),
    ),
    y_name: y?.asset.name,
    y_amount: Number(y?.toAmount()),
    y_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(y!).toAmount(),
    ),
    liquidity_usd: getLiquidityUsd(x!, y!, network),

    ...getPoolAnalyticsData(pool!),
  };
};

export const convertRedeemFormModelToAnalytics = (
  { xAmount, yAmount, lpAmount, percent }: RemoveFormModel,
  pool: AmmPool,
  network: Network<any, any>,
): AnalyticsRedeemData & AnalyticsPoolData => {
  return {
    percent_of_liquidity: percent,
    x_name: xAmount?.asset.name,
    x_amount: Number(xAmount?.toAmount()),
    x_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(xAmount!).toAmount(),
    ),
    y_name: yAmount?.asset.name,
    y_amount: Number(yAmount?.toAmount()),
    y_usd: Number(
      network.convertToConvenientNetworkAsset.snapshot(yAmount!).toAmount(),
    ),
    lp_amount: Number(lpAmount?.toAmount()),
    liquidity_usd: getLiquidityUsd(xAmount!, yAmount!, network),

    ...getPoolAnalyticsData(pool),
  };
};
