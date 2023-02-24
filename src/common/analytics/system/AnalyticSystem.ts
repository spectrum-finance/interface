import * as Amplitude from '@amplitude/analytics-browser';
import { PostHog } from 'posthog-js';

import { userProperties } from '../@types/userProperties';

export interface AnalyticSystem {
  system: PostHog | typeof Amplitude;
  captureEvent(
    name: string,
    props?: Record<string, unknown>,
    userProps?: userProperties,
  ): void;
}
