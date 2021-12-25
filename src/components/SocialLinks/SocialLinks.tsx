import './SocialLinks.less';

import React from 'react';

import { ReactComponent as DiscordIcon } from '../../assets/icons/social/Discord.svg';
import { ReactComponent as MediumIcon } from '../../assets/icons/social/Medium.svg';
import { ReactComponent as TelegramIcon } from '../../assets/icons/social/Telegram.svg';
import { ReactComponent as TwitterIcon } from '../../assets/icons/social/Twitter.svg';

const channels = [
  {
    url: 'https://twitter.com/ErgoDex',
    icon: <TwitterIcon />,
  },
  {
    url: 'https://t.me/ergodex_community',
    icon: <TelegramIcon />,
  },
  {
    url: 'https://discord.com/invite/6MFFG4Fn4Y',
    icon: <DiscordIcon />,
  },
  {
    url: 'https://ergodex.medium.com/',
    icon: <MediumIcon />,
  },
];

const SocialLinks = (): JSX.Element => {
  return (
    <ul className="social-links">
      {channels.map(({ url, icon }, index) => {
        return (
          <li key={index} className="social-links__item">
            <a
              className="social-links__link"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export { SocialLinks };
