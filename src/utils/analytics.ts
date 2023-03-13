import { fireAnalyticsEvent } from '@spectrumlabs/analytics';
import { AnalyticsEvents } from '@spectrumlabs/analytics/lib/cjs/types/events';
import { SwapProps } from '@spectrumlabs/analytics/lib/cjs/types/events/swap/props';
import { first } from 'rxjs';

import { selectedNetwork$ } from '../gateway/common/network';
import { Network } from '../network/common/Network';
import { networkAsset } from '../network/ergo/api/networkAsset/networkAsset';
import { SwapFormModel } from '../pages/Swap/SwapFormModel';

/*
    Add your abstactions here
*/

// export function withNetwork(cb) {
//   selectedNetwork$.pipe(
//     first(),
//     map((n) => {
//       return cb();
//     }),
//   );
// }

// export function fireAnalyticsEventWithNetwork(
//   eventName: keyof AnalyticsEvents,
//   eventProps: AnalyticsEvents[keyof AnalyticsEvents],
// ): void {
//   selectedNetwork$.pipe(first()).subscribe(({ name }) => {
//     fireAnalyticsEvent(eventName, eventProps, name);
//   });
// }

// export function mapToSwapProps(
//   { fromAsset, fromAmount, toAsset, toAmount }: SwapFormModel,
//   settings,
// ): SwapProps {
//   return {
//     from_name: fromAsset?.name || 'null',
//     from_amount: Number(fromAmount?.amount.toString()),
//     from_usd: Number(
//       network.convertToConvenientNetworkAsset.snapshot(fromAmount!).toAmount(),
//     ),
//     from_id: fromAsset?.id || 'null',
//     to_name: toAsset?.name || 'null',
//     to_amount: Number(toAmount?.amount.toString()),
//     to_usd: Number(
//       network.convertToConvenientNetworkAsset.snapshot(toAmount!).toAmount(),
//     ),
//     to_id: toAsset?.id || 'null',
//     settings_slippage: number,
//     settings_nitro: number,
//     settings_fee_currency: 'erg' | 'spf',
//     amm_pool_id: string,
//     amm_pool_name: string,
//     amm_pool_tvl: number,
//     amm_pool_fee: number,
//   };
// }

// fireAnalyticsEventWithNetwork('Swap Form Submit', mapToSwapProps(swapForm));

// const fireEventAsync = (name: string, props: Observable<object>) => {
//   props.subscribe((props) => fireEvent(name, props));
// };

// const withNetwork = (cb: Function): Function => {
//   return of(1).pipe(
//     first(),
//     map((n) => cb.bind(null, n)),
//   );
// };

// const mapSwapEvent = withNetwork((network: any, form: any): any => {
//   console.log(form, network);
// });

// fireEventAsync('Swap', mapSwapEvent(form1, form2, form3));
