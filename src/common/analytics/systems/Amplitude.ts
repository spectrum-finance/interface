import * as amplitude from '@amplitude/analytics-browser';

import { ProductAnalyticsSystem, userProperties } from '../@types/types';

export class Amplitude implements ProductAnalyticsSystem {
  name = 'Amplitude';
  system = amplitude;
  apiKey = process.env.REACT_APP_AMPLITUDE_API_KEY;

  public init(): Promise<void> {
    // We pass {} as options in this version
    if (this.apiKey) {
      return this.system.init(this.apiKey, undefined, {}).promise;
    } else {
      throw new Error(
        `Product Analytics Error: API key is not provided. Analytics system: ${this.name}`,
      );
    }
  }

  captureEvent(
    name: string,
    props?: Record<string, unknown>,
    userProps?: userProperties,
  ): void {
    const eventProps = props;

    if (userProps) {
      const event = new this.system.Identify();
      const { set, setOnce } = userProps;

      if (set) {
        Object.keys(set).forEach((propertyKey) =>
          event.set(propertyKey, set[propertyKey]),
        );
      }

      if (setOnce) {
        Object.keys(setOnce).forEach((propertyKey) =>
          event.setOnce(propertyKey, setOnce[propertyKey]),
        );
      }

      this.system.identify(event);
    }

    this.system.track(name, eventProps);
  }
}
