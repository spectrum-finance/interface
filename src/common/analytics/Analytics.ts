import { PostHog } from 'posthog-js';

import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { SupportedLocale } from '../constants/locales';
import { AmmPool } from '../models/AmmPool';
import {
  AnalyticsAppOperations,
  AnalyticsElementLocation,
  AnalyticsTheme,
  AnalyticsToken,
  AnalyticsTokenAssignment,
} from './@types/types';
import { AnalyticsWallet, AnalyticsWalletName } from './@types/wallet';
import { ANALYTICS_EVENTS } from './events';
import {
  constructEventName,
  convertDepositFormModelToAnalytics,
  convertSwapFormModelToAnalytics,
  debugEvent,
  getPoolAnalyticsData,
} from './utils';

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
    this.event(ANALYTICS_EVENTS.ACCEPT_KYA);
  }

  public acceptCookies(): void {
    this.event(ANALYTICS_EVENTS.ACCEPT_COOKIES);
  }

  public closeKya(): void {
    this.event(ANALYTICS_EVENTS.CLOSE_KYA);
  }

  public rejectCookies(): void {
    this.event(ANALYTICS_EVENTS.REJECT_COOKIES);
  }

  //Wallet
  public openConnectWalletModal(location: AnalyticsElementLocation): void {
    this.event(ANALYTICS_EVENTS.OPEN_CONNECT_WALLET_MODAL, { location });
  }

  public openWalletModal(): void {
    this.event(ANALYTICS_EVENTS.OPEN_WALLET_MODAL);
  }

  public connectWallet(props: AnalyticsWallet): void {
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, { $set: props });
  }

  public connectWalletError(walletName: AnalyticsWalletName): void {
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, walletName);
  }

  // --
  // Burger
  // --

  public clickBurgerMenu(menuName: string): void {
    const eventName = `Click Menu Item > ${menuName}`;
    this.event(eventName);
  }

  public changeTheme(theme: AnalyticsTheme): void {
    this.event(ANALYTICS_EVENTS.CHANGE_THEME, {
      $set: {
        theme,
      },
    });
  }

  public changeLocate(locale: SupportedLocale): void {
    this.event(ANALYTICS_EVENTS.CHANGE_LOCALE, {
      $set: {
        locale,
      },
    });
  }

  public selectToken(
    operation: AnalyticsAppOperations,
    tokenAssignment: AnalyticsTokenAssignment,
    { tokenName, tokenId }: AnalyticsToken,
  ): void {
    this.event(constructEventName('Select', { operation, tokenAssignment }), {
      token_name: tokenName,
      token_id: tokenId,
    });
  }

  public clickMaxButton(location: AnalyticsElementLocation): void {
    this.event(constructEventName('Click Max Button'), {
      location,
    });
  }

  // --
  // Swap
  // --

  public switchSwap(): void {
    this.event(ANALYTICS_EVENTS.SWAP_CLICK_SWITCH);
  }

  public clickChangePoolSwap(): void {
    this.event(ANALYTICS_EVENTS.SWAP_CLICK_CHANGE_POOL);
  }

  public changePoolSwap(pool: AmmPool): void {
    this.event(ANALYTICS_EVENTS.SWAP_CHANGE_POOL, getPoolAnalyticsData(pool));
  }

  public submitSwap(swapFormModel: SwapFormModel): void {
    this.event(
      ANALYTICS_EVENTS.SWAP_SUBMIT,
      convertSwapFormModelToAnalytics(swapFormModel),
    );
  }

  public confirmSwap(swapFormModel: SwapFormModel): void {
    this.event(
      ANALYTICS_EVENTS.SWAP_CONFIRM,
      convertSwapFormModelToAnalytics(swapFormModel),
    );
  }

  public signedSwap(swapFormModel: SwapFormModel, txId: string): void {
    this.event(ANALYTICS_EVENTS.SWAP_SIGNED, {
      tx_id: txId,
      ...convertSwapFormModelToAnalytics(swapFormModel),
    });
  }

  public signedErrorSwap(swapFormModel: SwapFormModel, err: any): void {
    this.event(ANALYTICS_EVENTS.SWAP_SIGNED_ERROR, {
      swap_signed_error: err,
      ...convertSwapFormModelToAnalytics(swapFormModel),
    });
  }

  // --
  // Deposit
  // --

  public submitDeposit(depositFromModel: AddLiquidityFormModel): void {
    this.event(
      ANALYTICS_EVENTS.DEPOSIT_SUBMIT,
      convertDepositFormModelToAnalytics(depositFromModel),
    );
  }

  public confirmDeposit(depositFromModel: AddLiquidityFormModel): void {
    this.event(
      ANALYTICS_EVENTS.DEPOSIT_CONFIRM,
      convertDepositFormModelToAnalytics(depositFromModel),
    );
  }

  public signedDeposit(
    depositFromModel: AddLiquidityFormModel,
    txId: string,
  ): void {
    this.event(ANALYTICS_EVENTS.DEPOSIT_SIGNED, {
      tx_id: txId,
      ...convertDepositFormModelToAnalytics(depositFromModel),
    });
  }

  public signedErrorDeposit(
    depositFromModel: AddLiquidityFormModel,
    err: any,
  ): void {
    this.event(ANALYTICS_EVENTS.DEPOSIT_SIGNED_ERROR, {
      deposit_signed_error: err,
      ...convertDepositFormModelToAnalytics(depositFromModel),
    });
  }

  public clickMaxDeposit(pct: number): void {
    this.event(`Deposit Click ${pct}`);
  }

  public clickCreatePoolDeposit(): void {
    this.event(ANALYTICS_EVENTS.DEPOSIT_CLICK_CREATE_POOL);
  }

  public clickPoolSelectDeposit(): void {
    this.event(ANALYTICS_EVENTS.DEPOSIT_CLICK_POOL_SELECT);
  }

  public selectPoolDeposit(pool: AmmPool): void {
    this.event(
      ANALYTICS_EVENTS.DEPOSIT_SELECT_POOL,
      getPoolAnalyticsData(pool),
    );
  }

  // --
  // Social
  // --

  public clickSocial(name: string): void {
    const eventName = `Click ${name.toUpperCase()}`;
    this.event(eventName);
  }
}
