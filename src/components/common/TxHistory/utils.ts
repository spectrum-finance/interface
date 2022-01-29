import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { uniqBy } from 'lodash';

import { Currency } from '../../../common/models/Currency';
import { getFormattedDate } from '../../../utils/date';
import { getAssetNameByMappedId } from '../../../utils/map';
import { Operation } from './types';

export const normalizeOperations = (ops: AmmDexOperation[]): Operation[] => {
  return uniqBy(
    ops.reduce((acc, op) => {
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
              timestamp: getFormattedDate(op.timestamp),
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
              timestamp: getFormattedDate(op.timestamp),
            },
          ];
        }
        if (op.order.type === 'redeem') {
          // TODO:[SDK]ADD_REDEEM_PAIR[EDEX-478]
          return acc;
        }
      }

      return acc;
    }, [] as any),
    (op) => op.txId,
  );
};
