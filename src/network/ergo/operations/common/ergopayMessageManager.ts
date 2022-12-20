import { Currency } from '../../../../common/models/Currency';
import { Address, TxId } from '../../../../common/types';
import { formatToUSD } from '../../../../services/number';
import { renderFractions } from '../../../../utils/math';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';

export interface SwapErgoPayParams {
  readonly from: Currency;
  readonly to: Currency;
  readonly feeMin: Currency;
  readonly feeMax: Currency;
}

export interface DepositErgoPayParams {
  readonly x: Currency;
  readonly y: Currency;
  readonly pool: ErgoAmmPool;
  readonly fee: Currency;
}

export interface RedeemErgoPayParams {
  readonly x: Currency;
  readonly y: Currency;
  readonly pool: ErgoAmmPool;
  readonly fee: Currency;
}

export interface RefundErgoPayParams {
  readonly txId: TxId;
  readonly address: Address;
  readonly fee: Currency;
}

export const ergoPayMessageManager = {
  swap({ from, feeMin, feeMax, to }: SwapErgoPayParams): string {
    return `
Spectrum
Operation: Swap
${from.toCurrencyString()} → ${to.toCurrencyString()}
Total fees: ${feeMin.toString()} - ${feeMax.toString()} ${feeMin.asset.ticker}
    `;
  },
  deposit({ pool, fee, x, y }: DepositErgoPayParams): string {
    return `
Spectrum
Operation: Add liquidity
Pool: ${pool.x.asset.ticker}/${pool.y.asset.ticker} (TVL: ${
      pool.tvl
        ? formatToUSD(
            renderFractions(pool.tvl.value, pool.tvl.units.currency.decimals),
            'abbr',
          )
        : '—'
    })
Assets: ${x.toCurrencyString()} and ${y.toCurrencyString()}
Total fees: ${fee.toCurrencyString()}
    `;
  },
  redeem({ pool, fee, x, y }: RedeemErgoPayParams): string {
    return `
Spectrum
Operation: Remove liquidity
Pool: ${pool.x.asset.ticker}/${pool.y.asset.ticker} (TVL: ${
      pool.tvl
        ? formatToUSD(
            renderFractions(pool.tvl.value, pool.tvl.units.currency.decimals),
            'abbr',
          )
        : '—'
    })
Assets: ${x.toCurrencyString()} and ${y.toCurrencyString()}
Total fees: ${fee.toCurrencyString()}
    `;
  },
  refund({ address, txId, fee }: RefundErgoPayParams): string {
    return `
Spectrum
Operation: Refund
Address: ${address}
TxId: ${txId}
Total fees: ${fee.toCurrencyString()}
    `;
  },
};
