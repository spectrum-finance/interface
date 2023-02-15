import * as Amplitude from '@amplitude/analytics-browser';

import { userProperties } from '../@types/userProperties';
import { AnalyticSystem } from './AnalyticSystem';

export class AmplitudeAnalyticSystem implements AnalyticSystem {
  system = Amplitude;

  captureEvent(
    name: string,
    props?: Record<string, unknown>,
    userProps?: userProperties | undefined,
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
