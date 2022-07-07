import { PostHog } from 'posthog-js';

import { $Set } from './@types/types';
import {
  AnalyticsConnectWalletLocation,
  AnalyticsWallet,
} from './@types/wallet';
import { ANALYTICS_EVENTS } from './events';

export class ProductAnalytics {
  analyticsSystems: Array<PostHog>;

  constructor(...analyticsSystems: PostHog[]) {
    this.analyticsSystems = analyticsSystems;
  }

  private event(name: string, props?: any): void {
    this.analyticsSystems.forEach((system) => {
      system.capture(name, props);
    });
  }

  // Onboarding
  public acceptKya(): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.ACCEPT_KYA} event`);
    this.event(ANALYTICS_EVENTS.ACCEPT_KYA);
  }

  public acceptCookies(): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.ACCEPT_COOKIES} event`);
    this.event(ANALYTICS_EVENTS.ACCEPT_COOKIES);
  }

  public closeKya(): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.CLOSE_KYA} event`);
    this.event(ANALYTICS_EVENTS.CLOSE_KYA);
  }

  public rejectCookies(): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.REJECT_COOKIES} event`);
    this.event(ANALYTICS_EVENTS.REJECT_COOKIES);
  }

  //Wallet
  public openConnectWalletModal(
    location: AnalyticsConnectWalletLocation,
  ): void {
    console.log(
      `Trigger ${ANALYTICS_EVENTS.OPEN_CONNECT_WALLET_MODAL} event`,
      `Props: location: ${location}`,
    );
    this.event(ANALYTICS_EVENTS.OPEN_CONNECT_WALLET_MODAL, { location });
  }

  public openWalletModal(): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.OPEN_WALLET_MODAL} event`);
    this.event(ANALYTICS_EVENTS.OPEN_WALLET_MODAL);
  }

  public connectWallet(props: $Set<AnalyticsWallet>): void {
    console.log(
      `Trigger ${ANALYTICS_EVENTS.CONNECT_WALLET} event`,
      `Props:\n`,
      props,
    );
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, props);
  }
}
