import { AmmPool } from 'ergo-dex-sdk';
import { math, renderFractions } from './math';
import ergo from 'ergo-dex-sdk';

export function renderPoolPrice(pool: AmmPool): string {
  return renderPrice(pool.x, pool.y);
}

export function renderPrice(x: ergo.AssetAmount, y: ergo.AssetAmount): string {
  const nameX = x.asset.name ?? x.asset.id.slice(0, 8);
  const nameY = y.asset.name ?? y.asset.id.slice(0, 8);
  const fmtX = renderFractions(x.amount, x.asset.decimals);
  const fmtY = renderFractions(y.amount, y.asset.decimals);
  if (Number(fmtX) > Number(fmtY)) {
    const p = math.evaluate!(`${fmtX} / ${fmtY}`).toFixed(
      x.asset.decimals ?? 0,
    );
    return `1 ${nameY} ≈ ${p} ${nameX}`;
  } else {
    const p = math.evaluate!(`${fmtY} / ${fmtX}`).toFixed(
      y.asset.decimals ?? 0,
    );
    return `1 ${nameX} ≈ ${p} ${nameY}`;
  }
}
