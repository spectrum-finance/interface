import { ProductAnalytics } from './Analytics';
import { Amplitude } from './systems/Amplitude';

export const panalytics = new ProductAnalytics(new Amplitude());
