import { AssetInfo } from '@ergolabs/ergo-sdk';
import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';

function tickerOf(asset: AssetInfo): string {
  return asset.name ? asset.name : asset.id.slice(0, 8);
}

function capitalize(s: string): string {
  if (s.length > 0) {
    const [h, tail] = [s[0], s.slice(1)];
    return h.toUpperCase() + tail;
  } else return s;
}

export function renderEntrySignature(op: AmmDexOperation): string {
  const opSig = capitalize(op.type);
  switch (op.type) {
    case 'order':
      const orderSig = capitalize(op.order.type);
      switch (op.order.type) {
        case 'swap':
          return orderSig;
        case 'deposit':
          const deposit = op.order;
          return `${orderSig} [${tickerOf(deposit.inX.asset)} + ${tickerOf(
            deposit.inY.asset,
          )}]`;
        case 'redeem':
          const redeem = op.order;
          return `${orderSig} [${tickerOf(redeem.inLP.asset)}]`;
      }
    case 'refund':
      return opSig;
    case 'setup':
      const pool = op.pool;
      return `${opSig} [${tickerOf(pool.reservesX.asset)} ↔ ${tickerOf(
        pool.reservesY.asset,
      )}]`;
  }
}
