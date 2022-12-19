import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { formatToUSD } from '../../../../services/number';
import { renderFractions } from '../../../../utils/math';

export const ergoPayMessageManager = {
  swap(
    from: Currency,
    to: Currency,
    feeMin: Currency,
    feeMax: Currency,
  ): string {
    return `
Spectrum
Operation: Swap
${from.toCurrencyString()} → ${to.toCurrencyString()}
Total fees: ${feeMin.toString()} - ${feeMax.toString()} ${feeMin.asset.ticker}
    `;
  },
  deposit(x: Currency, y: Currency, pool: AmmPool, feeMin: Currency): string {
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
Total fees: ${feeMin.toCurrencyString()}
    `;
  },
  redeem(x: Currency, y: Currency, pool: AmmPool, feeMin: Currency): string {
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
Total fees: ${feeMin.toCurrencyString()}
    `;
  },
  refund(txId: string, address: string, feeMin: Currency): string {
    return `
Spectrum
Operation: Refund
Address: ${address}
TxId: ${txId}
Total fees: ${feeMin.toCurrencyString()}
    `;
  },
};
