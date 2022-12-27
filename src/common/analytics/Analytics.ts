import Cookies from 'js-cookie';
import posthog, { PostHog } from 'posthog-js';
import { first, map, of, zip } from 'rxjs';

import { applicationConfig } from '../../applicationConfig';
import { applicationSettings$ } from '../../context';
import { selectedNetwork$ } from '../../gateway/common/network';
import { Network, SupportedNetworks } from '../../network/common/Network';
import { ergoNetwork } from '../../network/ergo/ergo';
import { AddLiquidityFormModel } from '../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { RemoveFormModel } from '../../pages/RemoveLiquidity/RemoveLiquidity';
import { SwapFormModel } from '../../pages/Swap/SwapFormModel';
import { SupportedLocale } from '../constants/locales';
import { Initializer } from '../initializers/core';
import { AmmPool } from '../models/AmmPool';
import {
  AnalyticsAppOperations,
  AnalyticsElementLocation,
  AnalyticsTheme,
  AnalyticsToken,
  AnalyticsTokenAssignment,
  AnalyticsWalletName,
  ProductAnalyticsSystem,
  userProperties,
} from './@types/types';
import { ANALYTICS_EVENTS } from './constants/events';
import {
  constructEventName,
  convertDepositFormModelToAnalytics,
  convertRedeemFormModelToAnalytics,
  convertSwapFormModelToAnalytics,
  debugEvent,
  getPoolAnalyticsData,
  isProductAnalyticsDebugMode,
  mapToFirstLaunchData,
  mapToSessionStartData,
} from './utils';

const ANALYTICS_SYSTEMS_INITIALIZED = 'analytics-systems-initialized';

export class ProductAnalytics {
  analyticsSystems: ProductAnalyticsSystem[];

  constructor(...analyticsSystems: Array<ProductAnalyticsSystem | undefined>) {
    this.analyticsSystems = analyticsSystems.filter(
      (system) => !!system,
    ) as ProductAnalyticsSystem[];
  }

  private event(name: string, props?: any, userProps?: userProperties): void {
    debugEvent(name, props, userProps);
    this.analyticsSystems.forEach((system) => {
      system.captureEvent(name, props, userProps);
    });
  }

  private withNetwork(cb: (n: Network<any, any>) => void): void {
    selectedNetwork$.pipe(first()).subscribe(cb);
  }

  public init: Initializer = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction || (!isProduction && isProductAnalyticsDebugMode())) {
      Promise.all(this.analyticsSystems.map((system) => system.init())).then(
        () => {
          if (Cookies.get(ANALYTICS_SYSTEMS_INITIALIZED) !== 'true') {
            Cookies.set(ANALYTICS_SYSTEMS_INITIALIZED, 'true', {
              domain: applicationConfig.cookieDomain,
            });
            this.firstLaunch();
          } else {
            this.sessionStart();
          }
        },
      );
    } else {
      console.warn('--PRODUCT ANALYTICS DOES NOT WORK LOCALLY--');
      return of(true);
    }

    return of(true);
  };

  public firstLaunch(): void {
    zip([selectedNetwork$, applicationSettings$])
      .pipe(first(), map(mapToFirstLaunchData))
      .subscribe(
        ({
          active_network,
          active_locale,
          active_theme,
          cohort_date,
          cohort_day,
          cohort_month,
          cohort_year,
          cohort_version,
        }) => {
          this.event(ANALYTICS_EVENTS.FIRST_LAUNCH, undefined, {
            set: {
              active_network,
              active_locale,
              active_theme,
            },
            setOnce: {
              cohort_date,
              cohort_day,
              cohort_month,
              cohort_year,
              cohort_version,
            },
          });
        },
      );
  }

  public sessionStart(): void {
    zip([selectedNetwork$, applicationSettings$])
      .pipe(first(), map(mapToSessionStartData))
      .subscribe(({ active_network, active_locale, active_theme }) => {
        this.event(ANALYTICS_EVENTS.SESSION_START, undefined, {
          set: {
            active_network,
            active_locale,
            active_theme,
          },
        });
      });
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

  public connectWallet(walletName?: AnalyticsWalletName): void {
    this.event(
      ANALYTICS_EVENTS.CONNECT_WALLET,
      { wallet_name: walletName },
      {
        set: { active_wallet: walletName },
        setOnce: { first_wallet: walletName },
      },
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
    const posthogSystem = this.analyticsSystems.find(
      ({ system }) => system === posthog,
    )?.system as PostHog;

    if (posthogSystem) {
      return {
        $operation: 'swap',
        $userId: posthogSystem.get_distinct_id(),
        ...convertSwapFormModelToAnalytics(swapFormModel, ergoNetwork as any),
      };
    }
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
    const posthogSystem = this.analyticsSystems.find(
      ({ system }) => system === posthog,
    )?.system as PostHog;

    if (posthogSystem) {
      return {
        $operation: 'deposit',
        $userId: posthogSystem.get_distinct_id(),
        ...convertDepositFormModelToAnalytics(
          depositFromModel,
          ergoNetwork as any,
        ),
      };
    }
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

  public closeConfirmRedeem(
    removeFromModel: RemoveFormModel,
    pool: AmmPool,
  ): void {
    this.withNetwork((network) => {
      this.event(
        ANALYTICS_EVENTS.REDEEM_CLOSE_CONFIRM,
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
    const posthogSystem = this.analyticsSystems.find(
      ({ system }) => system === posthog,
    )?.system as PostHog;

    if (posthogSystem) {
      return {
        $operation: 'redeem',
        $userId: posthogSystem.get_distinct_id(),
        ...convertRedeemFormModelToAnalytics(
          removeFromModel,
          pool,
          ergoNetwork as any,
        ),
      };
    }
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
