import posthog from 'posthog-js';

import { ProductAnalytics } from './Analytics';

export const panalytics = new ProductAnalytics(posthog);
