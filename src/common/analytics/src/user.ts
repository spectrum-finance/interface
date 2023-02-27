import { Identify, identify } from '@amplitude/analytics-browser';

import { analyticsConfig } from '.';

type AnalyticsValNetwork = 'ergo' | 'cardano';

type SetUserProps = {
  browser: string;
  user_agent: string;
  screen_resolution_height: number;
  screen_resolution_width: number;
  network_active: AnalyticsValNetwork;
  theme_active: string;
  address_active_ergo: string;
  address_active_cardano: string;
};

type SetOnceUserProps = {
  cohort_date: string;
  cohort_day: number;
  cohort_month: number;
  cohort_year: number;
  cohort_version: string;
  network_joined: AnalyticsValNetwork;
};

type PostInsertUserProps = {
  all_addresses_ergo: string[];
  all_addresses_cardano: string[];
};

export type UserProps = SetUserProps & SetOnceUserProps & PostInsertUserProps;

class User {
  private log(method: string, ...props: unknown[]) {
    // eslint-disable-next-line no-console
    console.debug(`[amplitude(Identify)]: ${method}(${props})`);
  }

  private call(mutate: (event: Identify) => Identify) {
    if (!analyticsConfig?.isProdEnv) {
      const log = (_: Identify, method: string) => this.log.bind(this, method);
      mutate(new Proxy(new Identify(), { get: log }));
      return;
    }
    identify(mutate(new Identify()));
  }

  set(key: keyof SetUserProps, value: SetUserProps[keyof SetUserProps]) {
    this.call((event) => event.set(key, value));
  }

  setOnce(
    key: keyof SetOnceUserProps,
    value: SetOnceUserProps[keyof SetOnceUserProps],
  ) {
    this.call((event) => event.setOnce(key, value));
  }

  // add(key: T, value: number) {
  //   this.call((event) => event.add(key, value));
  // }

  postInsert(
    key: keyof PostInsertUserProps,
    value: PostInsertUserProps[keyof PostInsertUserProps],
  ) {
    this.call((event) => event.postInsert(key, value));
  }

  remove(key: keyof UserProps, value: UserProps[keyof UserProps]) {
    this.call((event) => event.remove(key, value));
  }
}

export const user = new User();
