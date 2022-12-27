import { ProductAnalytics } from './Analytics';
import { Amplitude } from './systems/Amplitude';
import { Posthog } from './systems/Posthog';

export const panalytics = new ProductAnalytics(new Posthog(), new Amplitude());
