import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';

import { Currency } from '../../../common/models/Currency';
import { getAssetNameByMappedId } from '../../../utils/map';
import { getVerifiedPoolByName } from '../../../utils/verification';
import { Operation } from './types';

export const normalizeOperations = (ops: AmmDexOperation[]): Operation[] => {
  return uniqBy(
    ops.reduce((acc, op) => {
      const timestamp = DateTime.fromMillis(Number(op.timestamp));

      if (op.type === 'order') {
        if (op.order.type === 'swap') {
          return [
            ...acc,
            {
              assetX: new Currency(0n, op.order.from.asset),
              //TODO:[SDK]ADD_ASSET_Y_AS_ASSET_AMOUNT[]
              assetY: new Currency(
                0n,
                op.order.to.name
                  ? op.order.to
                  : {
                      id: op.order.to.id,
                      name: getAssetNameByMappedId(op.order.to.id),
                    },
              ),
              type: op.order.type,
              status: op.status,
              txId: op.txId,
              timestamp,
            },
          ];
        }
        if (op.order.type === 'deposit') {
          return [
            ...acc,
            {
              assetX: new Currency(op.order.inX.amount, op.order.inX.asset),
              assetY: new Currency(op.order.inY.amount, op.order.inY.asset),
              type: op.order.type,
              status: op.status,
              txId: op.txId,
              timestamp,
            },
          ];
        }
        if (op.order.type === 'redeem') {
          return [
            ...acc,
            {
              assetLp: new Currency(op.order.inLP.amount, op.order.inLP.asset),
              assetX: new Currency(
                0n,
                getVerifiedPoolByName(op.order.poolId)?.assetX,
              ),
              assetY: new Currency(
                0n,
                getVerifiedPoolByName(op.order.poolId)?.assetY,
              ),
              type: op.order.type,
              status: op.status,
              txId: op.txId,
              timestamp,
            },
          ];
        }
      }

      return acc;
    }, [] as any),
    (op) => op.txId,
  );
};
