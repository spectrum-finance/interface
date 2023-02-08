import posthog from 'posthog-js';

import { ProductAnalyticsSystem, userProperties } from '../@types/types';

export class Posthog implements ProductAnalyticsSystem {
  name = 'Posthog';
  system = posthog;
  apiKey = process.env.REACT_APP_POSTHOG_API_KEY;
  apiUrl = 'https://anph.spectrum.fi';

  public init(): Promise<any> {
    if (this.apiKey) {
      return new Promise((resolve) => {
        this.system.init(this.apiKey!, {
          api_host: this.apiUrl,
          autocapture: false,
          loaded: () => resolve(undefined),
        });
      });
    } else {
      throw new Error(
        `Product Analytics Error: API key is not provided. Analytics system: ${this.name}`,
      );
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
