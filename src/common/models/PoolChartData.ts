import { DateTime } from 'luxon';

import { AssetInfo } from './AssetInfo';
import { Ratio } from './Ratio';

interface PoolChartDataRaw {
  price: number;
  timestamp: number;
}

export class PoolChartData {
  public readonly price: Ratio;
  public readonly invertedPrice: Ratio;
  public date: DateTime;

  constructor(
    private raw: PoolChartDataRaw,
    private assetX: AssetInfo,
    private assetY: AssetInfo,
  ) {
    this.price = new Ratio(this.raw.price.toString(), assetX, assetY);
    this.invertedPrice = this.price.invertRatio();
    this.date = DateTime.fromMillis(this.raw.timestamp);
  }

  get ts(): number {
    return this.date.valueOf();
  }

  getRatio(isInverted = false): Ratio {
    return isInverted ? this.invertedPrice : this.price;
  }

  clone(raw?: Partial<PoolChartDataRaw>): PoolChartData {
    return new PoolChartData({ ...this.raw, ...raw }, this.assetX, this.assetY);
  }
}
