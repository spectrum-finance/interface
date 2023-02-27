import { ColumnHeightOutlined } from '@ergolabs/ui-kit';
// import React, {
//   Children,
//   cloneElement,
//   isValidElement,
//   memo,
//   PropsWithChildren,
//   SyntheticEvent,
// } from 'react';

// import { fireAnalyticsEvent } from '.';
// import { AnalyticsEvents } from './@types/events';
// import { ITraceContext, Trace, TraceContext } from './Trace';

// type TraceEventProps = {
//   events: string[];
//   name: keyof AnalyticsEvents;
//   properties?: AnalyticsEvents[keyof AnalyticsEvents];
//   shouldLogImpression?: boolean;
// } & ITraceContext;

// /**
//  * Analytics instrumentation component that wraps event callbacks with logging logic.
//  *
//  * @example
//  *  <TraceEvent events={[Event.onClick]} element={ElementName.SWAP_BUTTON}>
//  *    <Button onClick={() => console.log('clicked')}>Click me</Button>
//  *  </TraceEvent>
//  */
// export const TraceEvent = memo((props: PropsWithChildren<TraceEventProps>) => {
//   const {
//     shouldLogImpression,
//     name,
//     properties,
//     events,
//     children,
//     ...traceProps
//   } = props;

//   return (
//     <Trace {...traceProps}>
//       <TraceContext.Consumer>
//         {(traceContext) =>
//           Children.map(children, (child) => {
//             if (!isValidElement(child)) {
//               return child;
//             }
//             console.log('valid child');

//             // For each child, augment event handlers defined in `events` with event tracing.
//             return cloneElement(
//               child,
//               getEventHandlers(
//                 child,
//                 traceContext,
//                 events,
//                 name,
//                 properties,
//                 shouldLogImpression,
//               ),
//             );
//           })
//         }
//       </TraceContext.Consumer>
//     </Trace>
//   );
// });

// TraceEvent.displayName = 'TraceEvent';

// /**
//  * Given a set of child element and event props, returns a spreadable
//  * object of the event handlers augmented with analytics logging.
//  */
// function getEventHandlers(
//   child: React.ReactElement,
//   traceContext: ITraceContext,
//   events: string[],
//   name: keyof AnalyticsEvents,
//   properties?: AnalyticsEvents[keyof AnalyticsEvents],
//   shouldLogImpression = true,
// ) {
//   const eventHandlers: Partial<
//     Record<string, (e: SyntheticEvent<Element, string>) => void>
//   > = {};
//   console.log('----------');
//   console.log('--TraceEvent--');
//   console.log('events', events);
//   console.log('child', child);

//   for (const event of events) {
//     console.log('event', event);

//     eventHandlers[event] = (eventHandlerArgs: unknown) => {
//       // call child event handler with original arguments, must be in array
//       const args = Array.isArray(eventHandlerArgs)
//         ? eventHandlerArgs
//         : [eventHandlerArgs];
//       child.props[event]?.apply(child, args);
//       console.log('child', child);

//       // augment handler with analytics logging
//       if (shouldLogImpression) {
//         // fireAnalyticsEvent(name, {
//         //   ...traceContext,
//         //   ...properties,
//         //   action: event,
//         // });
//         console.log('TraceEvent', 'Log traceContext', traceContext);
//         console.log('name, properties', name, properties);
//         fireAnalyticsEvent(name, properties);
//       }
//     };
//   }

//   // return a spreadable event handler object
//   return eventHandlers;
// }
