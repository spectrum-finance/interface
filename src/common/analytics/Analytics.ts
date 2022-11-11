import * as Amplitude from '@amplitude/analytics-browser';
import posthog, { PostHog } from 'posthog-js';
import { first } from 'rxjs';

import { selectedNetwork$ } from '../../gateway/common/network';
import { Network, SupportedNetworks } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { RemoveFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidity';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { SupportedLocale } from '../constants/locales';
import { AmmPool } from '../models/AmmPool';
import { AnalyticsLaunchData } from './@types/launch';
import {
  AnalyticsAppOperations,
  AnalyticsElementLocation,
  AnalyticsTheme,
  AnalyticsToken,
  AnalyticsTokenAssignment,
} from './@types/types';
import { userProperties } from './@types/userProperties';
import { AnalyticsWalletName } from './@types/wallet';
import { ANALYTICS_EVENTS } from './events';
import { AnalyticSystem } from './system/AnalyticSystem';
import {
  constructEventName,
  convertDepositFormModelToAnalytics,
  convertRedeemFormModelToAnalytics,
  convertSwapFormModelToAnalytics,
  debugEvent,
  getPoolAnalyticsData,
} from './utils';

export class ProductAnalytics {
  analyticsSystems: AnalyticSystem[];

  constructor(...analyticsSystems: AnalyticSystem[]) {
    this.analyticsSystems = analyticsSystems;
  }

  private event(name: string, props?: any, userProps?: userProperties): void {
    debugEvent(name, props);
    this.analyticsSystems.forEach((system) => {
      system.captureEvent(name, props, userProps);
    });
  }

  private withNetwork(cb: (n: Network<any, any>) => void): void {
    selectedNetwork$.pipe(first()).subscribe(cb);
  }

  public firstLaunch(userProps?: userProperties): void {
    this.event(ANALYTICS_EVENTS.FIRST_LAUNCH, {}, userProps);
  }

  public sessionStart(userProps?: userProperties): void {
    this.event(ANALYTICS_EVENTS.SESSION_START, {}, userProps);
  }

  // Onboarding

  public acceptCookies(): void {
    this.event(ANALYTICS_EVENTS.ACCEPT_COOKIES);
  }

  public rejectCookies(): void {
    this.event(ANALYTICS_EVENTS.REJECT_COOKIES);
  }
  // --
  // Network
  // --

  public changeNetwork(network: SupportedNetworks): void {
    this.event(ANALYTICS_EVENTS.CHANGE_NETWORK, { active_network: network });
  }

  // --
  //Wallet
  // --
  public openConnectWalletModal(location: AnalyticsElementLocation): void {
    this.event(ANALYTICS_EVENTS.OPEN_CONNECT_WALLET_MODAL, {
      elem_location: location,
    });
  }

  public openWalletModal(): void {
    this.event(ANALYTICS_EVENTS.OPEN_WALLET_MODAL);
  }

  public connectWallet(
    walletName?: AnalyticsWalletName,
    userProps?: userProperties,
  ): void {
    this.event(
      ANALYTICS_EVENTS.CONNECT_WALLET,
      { wallet_name: walletName },
      userProps,
    );
  }

  public connectWalletError(walletName?: AnalyticsWalletName): void {
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET, { wallet_name: walletName });
  }

  public connectWalletInstallExtension(walletName?: AnalyticsWalletName): void {
    this.event(ANALYTICS_EVENTS.CONNECT_WALLET_INSTALL_EXTENSION, {
      wallet_name: walletName,
    });
  }

  public disconnectWallet(walletName?: AnalyticsWalletName): void {
    this.event(ANALYTICS_EVENTS.DISCONNECT_WALLET, { wallet_name: walletName });
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
      active_theme: theme,
    });
  }

  public changeLocale(locale: SupportedLocale): void {
    this.event(ANALYTICS_EVENTS.CHANGE_LOCALE, {
      active_locale: locale,
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
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.SWAP_SUBMIT,
        convertSwapFormModelToAnalytics(swapFormModel, network),
      );
    });
  }

  public closeConfirmSwap(swapFormModel: SwapFormModel): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.SWAP_CLOSE_CONFIRM,
        convertSwapFormModelToAnalytics(swapFormModel, network),
      );
    });
  }

  public confirmSwap(swapFormModel: SwapFormModel): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.SWAP_CONFIRM,
        convertSwapFormModelToAnalytics(swapFormModel, network),
      );
    });
  }

  public signedSwap(swapFormModel: SwapFormModel, txId: string): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.SWAP_SIGNED, {
        tx_id: txId,
        ...convertSwapFormModelToAnalytics(swapFormModel, network),
      });
    });
  }

  public buildErgopaySignedSwapEvent(swapFormModel: SwapFormModel): any {
    return {
      $operation: 'swap',
      $userId: this.analyticsSystems[0].get_distinct_id(),
      ...convertSwapFormModelToAnalytics(swapFormModel, ergoNetwork as any),
    };
  }

  public signedErrorSwap(swapFormModel: SwapFormModel, err: any): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.SWAP_SIGNED_ERROR, {
        err_msg: err,
        ...convertSwapFormModelToAnalytics(swapFormModel, network),
      });
    });
  }

  // --
  // Deposit
  // --

  public submitDeposit(depositFromModel: AddLiquidityFormModel): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.DEPOSIT_SUBMIT,
        convertDepositFormModelToAnalytics(depositFromModel, network),
      );
    });
  }

  public confirmDeposit(depositFromModel: AddLiquidityFormModel): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.DEPOSIT_CONFIRM,
        convertDepositFormModelToAnalytics(depositFromModel, network),
      );
    });
  }

  public signedDeposit(
    depositFromModel: AddLiquidityFormModel,
    txId: string,
  ): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.DEPOSIT_SIGNED, {
        tx_id: txId,
        ...convertDepositFormModelToAnalytics(depositFromModel, network),
      });
    });
  }

  public buildErgopaySignedDepositEvent(
    depositFromModel: AddLiquidityFormModel,
  ): any {
    return {
      $operation: 'deposit',
      $userId: this.analyticsSystems[0].get_distinct_id(),
      ...convertDepositFormModelToAnalytics(
        depositFromModel,
        ergoNetwork as any,
      ),
    };
  }

  public signedErrorDeposit(
    depositFromModel: AddLiquidityFormModel,
    err: any,
  ): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.DEPOSIT_SIGNED_ERROR, {
        err_msg: err,
        ...convertDepositFormModelToAnalytics(depositFromModel, network),
      });
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
  // Redeem
  // --
  public submitRedeem(removeFromModel: RemoveFormModel, pool: AmmPool): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.REDEEM_SUBMIT,
        convertRedeemFormModelToAnalytics(removeFromModel, pool, network),
      );
    });
  }

  public confirmRedeem(removeFromModel: RemoveFormModel, pool: AmmPool): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.REDEEM_CONFIRM,
        convertRedeemFormModelToAnalytics(removeFromModel, pool, network),
      );
    });
  }

  public signedRedeem(
    removeFromModel: RemoveFormModel,
    pool: AmmPool,
    txId: string,
  ): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.REDEEM_SIGNED, {
        tx_id: txId,
        ...convertRedeemFormModelToAnalytics(removeFromModel, pool, network),
      });
    });
  }

  public buildErgopaySignedRedeemEvent(
    removeFromModel: RemoveFormModel,
    pool: AmmPool,
  ): any {
    return {
      $operation: 'redeem',
      $userId: this.analyticsSystems[0].get_distinct_id(),
      ...convertRedeemFormModelToAnalytics(
        removeFromModel,
        pool,
        ergoNetwork as any,
      ),
    };
  }

  public signedErrorRedeem(
    removeFromModel: RemoveFormModel,
    pool: AmmPool,
    err: any,
  ): void {
    this.withNetwork((network) => {
      this.event(ANALYTICS_EVENTS.REDEEM_SIGNED_ERROR, {
        error: err,
        ...convertRedeemFormModelToAnalytics(removeFromModel, pool, network),
      });
    });
  }

  // --
  // Social
  // --

  public clickSocial(name: string, location: AnalyticsElementLocation): void {
    const eventName = `Click ${name.toUpperCase()}`;
    this.event(eventName, { location });
  }

  public catalystCta(): void {
    this.event(ANALYTICS_EVENTS.CATALYST_CTA);
  }

  public catalystClose(): void {
    this.event(ANALYTICS_EVENTS.CATALYST_CLOSE);
  }

  public liquidityAdd(): void {
    this.event(ANALYTICS_EVENTS.LIQUIDITY_ADD);
  }

  public liquidityCreatePool(): void {
    this.event(ANALYTICS_EVENTS.LIQUIDITY_CREATE_POOL);
  }
}
