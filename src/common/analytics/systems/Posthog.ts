import posthog from 'posthog-js';

import { ProductAnalyticsSystem, userProperties } from '../@types/types';
import { throwProductAnalyticsError } from '../utils';

export class Posthog implements ProductAnalyticsSystem {
  name = 'Posthog';
  system = posthog;
  apiKey = process.env.REACT_APP_POSTHOG_API_KEY;
  apiUrl = 'https://anph.spectrum.fi';

  public init(loaded: () => void): void {
    if (this.apiKey) {
      this.system.init(this.apiKey, {
        api_host: this.apiUrl,
        autocapture: false,
        loaded,
      });
    } else {
      throwProductAnalyticsError(this.name, 'API key is not provided');
    }
  }

  public captureEvent(
    name: string,
    props: Record<string, unknown>,
    userProps?: userProperties | undefined,
  ): void {
    let eventProps = props;

    if (userProps?.set) {
      eventProps = { ...eventProps, $set: userProps?.set };
    }

    if (userProps?.setOnce) {
      eventProps = { ...eventProps, $set_once: userProps?.setOnce };
    }

    this.system.capture(name, eventProps);
  }
}
