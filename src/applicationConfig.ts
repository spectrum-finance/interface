interface ApplicationConfig {
  readonly api: string;
  readonly social: {
    readonly twitter: string;
    readonly telegram: string;
    readonly discord: string;
    readonly medium: string;
    readonly reddit: string;
  };
  readonly support: {
    readonly discord: string;
    readonly telegram: string;
  };
  readonly applicationTick: number;
}

export const applicationConfig: ApplicationConfig = {
  api: 'https://api.ergodex.io/v1/',
  social: {
    twitter: 'https://twitter.com/ErgoDex',
    telegram: 'https://t.me/ergodex_community',
    discord: 'https://discord.com/invite/6MFFG4Fn4Y',
    medium: 'https://ergodex.medium.com/',
    reddit: 'https://www.reddit.com/r/ergodex/',
  },
  support: {
    discord: 'https://discord.gg/Jya72kjDfq',
    telegram: 'https://t.me/ergodex_community',
  },
  applicationTick: 10 * 1000,
};
