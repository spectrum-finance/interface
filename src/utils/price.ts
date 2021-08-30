import { AmmPool } from 'ergo-dex-sdk';
import { math, renderFractions } from './math';

export function renderPrice(pool: AmmPool): string {
  const nameX = pool.x.asset.name ?? pool.x.asset.id.slice(0, 8);
  const nameY = pool.y.asset.name ?? pool.y.asset.id.slice(0, 8);
  const fmtX = renderFractions(pool.x.amount, pool.x.asset.decimals);
  const fmtY = renderFractions(pool.y.amount, pool.y.asset.decimals);
  if (fmtX > fmtY) {
    const p = math.evaluate!(`${fmtX} / ${fmtY}`).toFixed(
      pool.x.asset.decimals ?? 0,
    );
    return `1 ${nameY} ≈ ${p} ${nameX}`;
  } else {
    const p = math.evaluate!(`${fmtY} / ${fmtX}`).toFixed(
      pool.y.asset.decimals ?? 0,
    );
    return `1 ${nameX} ≈ ${p} ${nameY}`;
  }
}
