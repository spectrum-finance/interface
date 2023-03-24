import { FeeCurrency, fireAnalyticsEvent } from '@spectrumlabs/analytics';
import { AnalyticsEvents } from '@spectrumlabs/analytics/lib/cjs/types/events';
import { combineLatest, first } from 'rxjs';

import { SPF_TOKEN_ERGO_ID } from '../../common/constants/spf';
import { Network } from '../../network/common/Network';
import { selectedNetwork$ } from '../common/network';
import { settings$ } from '../settings/settings';

export interface EventProducerContext {
  readonly network: Network<any, any>;
  readonly slippage: number;
  readonly nitro: number;
  readonly feeCurrency: FeeCurrency;
}

export type EventProducer<T extends keyof AnalyticsEvents, P = any> = (
  params: P,
) => (
  ctx: EventProducerContext,
) => AnalyticsEvents[T] extends undefined ? [undefined?] : [AnalyticsEvents[T]];

export const fireOperationAnalyticsEvent = <T extends keyof AnalyticsEvents>(
  eventName: T,
  eventPropsFactory: ReturnType<EventProducer<T>>,
): void => {
  combineLatest([settings$, selectedNetwork$])
    .pipe(first())
    .subscribe(([settings, selectedNetwork]) => {
      const ergTicker =
        settings?.executionFeeAsset?.id === SPF_TOKEN_ERGO_ID
          ? 'ergo-spf'
          : 'ergo-erg';

      const feeCurrency: EventProducerContext['feeCurrency'] =
        selectedNetwork.name === 'cardano' ? 'cardano-ada' : ergTicker;

      fireAnalyticsEvent(
        eventName,
        ...eventPropsFactory({
          slippage: settings.slippage,
          nitro: settings.nitro,
          network: selectedNetwork,
          feeCurrency,
        }),
      );
    });
};
