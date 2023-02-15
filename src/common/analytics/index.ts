import { ProductAnalytics } from './Analytics';
import { PostHogAnalyticSystem } from './system/PostHogAnalyticSystem';

export const panalytics = new ProductAnalytics(
  new PostHogAnalyticSystem(),
  // new AmplitudeAnalyticSystem(),
);
