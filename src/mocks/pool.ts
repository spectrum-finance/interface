import { AmmPool as BaseAmmPool } from '@ergolabs/ergo-dex-sdk';

import { AmmPool } from '../common/models/AmmPool';
import { mockAsset } from './asset';

export const basePoolMock = new BaseAmmPool(
  '9916d75132593c8b07fe18bd8d583bda1652eed7565cf41a4738ddd90fc992ec',
  mockAsset,
  mockAsset,
  mockAsset,
  995,
);
