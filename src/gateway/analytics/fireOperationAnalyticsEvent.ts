import { fireAnalyticsEvent as baseFireAnalyticsEvent } from '@spectrumlabs/analytics';
import { AnalyticsEvents } from '@spectrumlabs/analytics/lib/cjs/types/events';
import { ThemeProps } from '@spectrumlabs/analytics/lib/cjs/types/events/generalProps';
import { combineLatest, first } from 'rxjs';

import { localStorageManager } from '../../common/utils/localStorageManager';
import { Settings } from '../../context';
import { SupportedNetworks } from '../../network/common/Network';
import { selectedNetwork$ } from '../common/network';
import { settings$ } from '../settings/settings';

export interface EventProducerContext {
  readonly network: SupportedNetworks;
  readonly slippage: number;
  readonly nitro: number;
  readonly feeCurrency: 'erg' | 'spf' | 'ada';
  readonly theme: ThemeProps['theme'];
}

export type EventProducer<R extends keyof AnalyticsEvents, P = any> = (
  params: P,
) => (ctx: EventProducerContext) => AnalyticsEvents[R];

export const fireOperationAnalyticsEvent = <K extends keyof AnalyticsEvents>(
  eventName: K,
  eventPropsFactory: ReturnType<EventProducer<K>>,
): void => {
  combineLatest([settings$, selectedNetwork$])
    .pipe(first())
    .subscribe(([settings, selectedNetwork]) => {
      const theme: ThemeProps['theme'] =
        localStorageManager.get<Settings>('settings')?.theme || 'light';

      const ergTicker: 'erg' | 'spf' =
        (settings?.executionFeeAsset?.ticker?.toLowerCase() as any) || 'erg';
      const feeCurrency: EventProducerContext['feeCurrency'] =
        selectedNetwork.name === 'cardano' ? 'ada' : ergTicker;

      baseFireAnalyticsEvent(
        eventName,
        eventPropsFactory({
          slippage: settings.slippage,
          nitro: settings.nitro,
          network: selectedNetwork.name,
          feeCurrency,
          theme,
        }),
      );
    });
};
