import { EmissionLP } from '@spectrumlabs/cardano-dex-sdk';

import { networkAsset } from '../../network/cardano/api/networkAsset/networkAsset';
import { Currency } from '../models/Currency';
import { Position } from '../models/Position';

const ADA_THRESHOLD = new Currency('15', networkAsset);

// Only for n2t
export const normalizeAvailableLp = (
  position: Position,
): [Currency, Currency, Currency] => {
  if (
    !position.pool.x.isAssetEquals(networkAsset) &&
    !position.pool.y.isAssetEquals(networkAsset)
  ) {
    return [position.availableLp, position.availableX, position.availableY];
  }
  const totalLockedLp = EmissionLP - position.pool.lp.amount;
  const [totalLockedX, totalLockedY] = position.pool.shares(
    new Currency(totalLockedLp, position.pool.lp.asset),
  );
  const totalAda = position.pool.x.isAssetEquals(networkAsset)
    ? position.pool.x
    : position.pool.y;
  const totalLockedAda = totalLockedX.isAssetEquals(networkAsset)
    ? totalLockedX
    : totalLockedY;
  const userLockedAda = position.availableX.isAssetEquals(networkAsset)
    ? position.availableX
    : position.availableY;

  if (
    totalLockedAda.minus(userLockedAda).gt(ADA_THRESHOLD) ||
    userLockedAda.lte(ADA_THRESHOLD)
  ) {
    return [position.availableLp, position.availableX, position.availableY];
  }

  const availableAdaToUnlock = userLockedAda.minus(ADA_THRESHOLD);
  const availableLpToUnlock = new Currency(
    (availableAdaToUnlock.amount * totalLockedLp) / totalAda.amount,
    position.pool.lp.asset,
  );
  const [availableXToUnlock, availableYToUnlock] =
    position.pool.shares(availableLpToUnlock);

  return [availableLpToUnlock, availableXToUnlock, availableYToUnlock];
};
