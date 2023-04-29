import { FeeCurrency, fireAnalyticsEvent } from '@spectrumlabs/analytics';
import { AnalyticsEvents } from '@spectrumlabs/analytics';
import { combineLatest, first, from, switchMap } from 'rxjs';

import { SPF_TOKEN_ERGO_ID } from '../../common/constants/spf';
import { Network } from '../../network/common/Network';
export interface EventProducerContext {
  readonly network: Network<any, any>;
  readonly slippage: number;
  readonly nitro: number;
  readonly feeCurrency: FeeCurrency;
}

export type EventProducer<T extends keyof AnalyticsEvents, P = any> = (
  params: P,
) => (ctx: EventProducerContext) => AnalyticsEvents[T];

export const fireOperationAnalyticsEvent = <T extends keyof AnalyticsEvents>(
  eventName: T,
  ...rest: AnalyticsEvents[T] extends undefined
    ? [undefined?]
    : [ReturnType<EventProducer<T>>]
): void => {
  from(
    Promise.all([
      import('../settings/settings.ts').then(
        (settingsModule) => settingsModule.settings$,
      ),
      import('../common/network.ts').then(
        (networkModule) => networkModule.selectedNetwork$,
      ),
    ]),
  )
    .pipe(
      switchMap(([settings$, selectedNetwork$]) =>
        combineLatest([settings$, selectedNetwork$]).pipe(first()),
      ),
    )
    .subscribe(([settings, selectedNetwork]) => {
      const ergTicker =
        settings?.executionFeeAsset?.id === SPF_TOKEN_ERGO_ID
          ? 'ergo-spf'
          : 'ergo-erg';

      const feeCurrency: EventProducerContext['feeCurrency'] =
        selectedNetwork.name === 'cardano' ? 'cardano-ada' : ergTicker;
      const eventPropsFactory = rest[0];
      const props = (
        eventPropsFactory
          ? [
              eventPropsFactory({
                slippage: settings.slippage,
                nitro: settings.nitro,
                network: selectedNetwork,
                feeCurrency,
              }),
            ]
          : []
      ) as AnalyticsEvents[T] extends undefined
        ? [undefined?]
        : [AnalyticsEvents[T]];

      fireAnalyticsEvent(eventName, ...props);
    });
};
