import posthog from 'posthog-js';

import { userProperties } from '../@types/userProperties';
import { AnalyticSystem } from './AnalyticSystem';

export class PostHogAnalyticSystem implements AnalyticSystem {
  system = posthog;

  captureEvent(
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
