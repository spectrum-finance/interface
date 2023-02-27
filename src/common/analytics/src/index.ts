import {
  getDeviceId as getAmplitudeDeviceId,
  getSessionId as getAmplitudeSessionId,
  getUserId as getAmplitudeUserId,
  init,
  track,
} from '@amplitude/analytics-browser';

import { AppName, CustomTransport } from './CustomTransport';
import { AnalyticsEvents } from './events';

type AnalyticsConfig = {
  proxyUrl?: string;
  commitHash?: string;
  defaultEventName?: string;
  version?: string;
  // If false or undefined, does not set user properties on the Amplitude client
  isProdEnv?: boolean;
  // When enabled, logs events before sending to amplitude
  isDebug?: boolean;
};

let isInitialized = false;

export let analyticsConfig: AnalyticsConfig | undefined;

/**
 * Initializes Amplitude with API key for project
 *
 * Spectrum Finance has two Amplitude projects: test and production. You must be a
 * team member to see details
 *
 * @param apiKey API key of the application
 * @param appName The name of the application. Used to rout the events to a correct project
 * @param config Contains configuration options: https://www.docs.developers.amplitude.com/data/sdks/typescript-browser/#configuration
 */
export function initAnalytics(
  apiKey: string,
  appName: AppName,
  config?: AnalyticsConfig,
): void {
  // Non-production environments may use hot-reloading, which will re-initialize but should be ignored.
  if (!config?.isProdEnv && isInitialized) {
    return;
  }

  if (config?.isProdEnv) {
    if (isInitialized) {
      throw new Error(
        "initAnalytics was called multiple times. Make sure you don't use it in a React component",
      );
    }

    if (config.isDebug) {
      throw new Error(
        `It looks like you're trying to initialize analytics in debug mode for production. Disable debug mode or use a non-production environment.`,
      );
    }
  }

  analyticsConfig = config;

  init(
    /* apiKey = */ apiKey,
    /* User ID is set to, */ undefined /* to let Amplitude default to Device ID */,
    {
      serverUrl: config?.proxyUrl,
      transportProvider: new CustomTransport(appName),

      appVersion: config?.version,

      // Disabling tracking of private user data
      trackingOptions: {
        ipAddress: false,
        carrier: false,
        city: false,
        region: false,
        dma: false,
      },
    },
  ).promise.then(() => {
    isInitialized = true;
  });
}

export function getDeviceId(): string | undefined {
  return getAmplitudeDeviceId();
}

export function getUserId(): string | undefined {
  return getAmplitudeUserId();
}

export function getSessionId(): number | undefined {
  return getAmplitudeSessionId();
}

export function fireAnalyticsEvent(
  eventName: keyof AnalyticsEvents,
  eventProps?: AnalyticsEvents[keyof AnalyticsEvents],
): void {
  const origin = window.location.origin;
  track(eventName, { ...eventProps, origin });
}
