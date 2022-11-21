import { ProductAnalytics } from './Analytics';
import { AmplitudeAnalyticSystem } from './system/AmplitudeAnalyticSystem';
import { PostHogAnalyticSystem } from './system/PostHogAnalyticSystem';

export const panalytics = new ProductAnalytics(
  process.env.REACT_APP_POSTHOG_API_KEY
    ? new PostHogAnalyticSystem()
    : undefined,
  process.env.REACT_APP_AMPLITUDE_API_KEY
    ? new AmplitudeAnalyticSystem()
    : undefined,
);
