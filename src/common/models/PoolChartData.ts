import { DateTime } from 'luxon';

import { AssetInfo } from './AssetInfo';
import { Ratio } from './Ratio';

export interface PoolChartDataRaw {
  price: number;
  timestamp: number;
}

export class PoolChartData {
  public readonly price: Ratio;
  public readonly invertedPrice: Ratio;
  public readonly date: DateTime;
  public readonly ts: number;

  constructor(
    private raw: PoolChartDataRaw,
    private assetX: AssetInfo,
    private assetY: AssetInfo,
  ) {
    this.ts = this.raw.timestamp;
    this.price = new Ratio(this.raw.price.toString(), assetY, assetX);
    this.invertedPrice = this.price.invertRatio();
    this.date = DateTime.fromMillis(this.raw.timestamp);
  }

  getRatio(isInverted = false): Ratio {
    return isInverted ? this.invertedPrice : this.price;
  }

  clone(raw?: Partial<PoolChartDataRaw>): PoolChartData {
    return new PoolChartData({ ...this.raw, ...raw }, this.assetX, this.assetY);
  }
}
