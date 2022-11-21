import { ProductAnalytics } from './Analytics';
import { AmplitudeAnalyticSystem } from './system/AmplitudeAnalyticSystem';
import { PostHogAnalyticSystem } from './system/PostHogAnalyticSystem';

export const panalytics = new ProductAnalytics(
  new PostHogAnalyticSystem(),
  new AmplitudeAnalyticSystem(),
);
