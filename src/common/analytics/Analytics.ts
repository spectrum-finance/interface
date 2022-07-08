import { PostHog } from 'posthog-js';

import { SupportedLocale } from '../constants/locales';
import { AnalyticsTheme } from './@types/types';
import {
  AnalyticsConnectWalletLocation,
  AnalyticsWallet,
  AnalyticsWalletName,
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

  // Launch
  // public firstLaunch({
  //   network,
  //   theme,
  //   appSettings,
  //   opSettings,
  // }: AnalyticsLaunchData) {
  //   this.event(ANALYTICS_EVENTS.FIRST_LAUNCH, {
  //     $set_once: {
  //       network,
  //       theme,
  //       appSettings,
  //       opSettings,
  //     },
  //   });
  // }
  //
  // public sessionLaunch({ network, theme, appSettings, opSettings }) {
  //   this.event(ANALYTICS_EVENTS.SESSION_LAUNCH, {
  //     $set: {
  //       network,
  //       theme,
  //       appSettings,
  //       opSettings,
  //     },
  //   });
  // }

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

  public connectWallet(props: AnalyticsWallet): void {
    console.log(
      `Trigger ${ANALYTICS_EVENTS.CONNECT_WALLET} event`,
      `Props:\n`,
      props,
    );
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, { $set: props });
  }

  public connectWalletError(walletName: AnalyticsWalletName): void {
    console.log(
      `Trigger ${ANALYTICS_EVENTS.CONNECT_WALLET} event`,
      `Props:\n`,
      { walletName },
    );
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, walletName);
  }

  // Burger
  public clickBurgerMenu(menuName: string): void {
    const eventName = `Click Menu Item > ${menuName}`;
    console.log(`Trigger ${eventName} event`);
    this.event(eventName);
  }

  public changeTheme(theme: AnalyticsTheme): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.CHANGE_THEME} event`, `Props:\n`, {
      theme,
    });
    this.event(ANALYTICS_EVENTS.CHANGE_THEME, {
      $set: {
        theme,
      },
    });
  }

  public changeLocate(locale: SupportedLocale): void {
    console.log(`Trigger ${ANALYTICS_EVENTS.CHANGE_LOCALE} event`, `Props:\n`, {
      locale,
    });
    this.event(ANALYTICS_EVENTS.CHANGE_LOCALE, {
      $set: {
        locale,
      },
    });
  }

  // Social
  public clickSocial(name: string): void {
    const eventName = `Click ${name.toUpperCase()}`;
    this.event(eventName);
  }
}
