import './SocialLinks.less';

import React from 'react';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as DiscordIcon } from '../../assets/icons/social/Discord.svg';
import { ReactComponent as MediumIcon } from '../../assets/icons/social/Medium.svg';
import { ReactComponent as RedditIcon } from '../../assets/icons/social/Reddit.svg';
import { ReactComponent as TelegramIcon } from '../../assets/icons/social/Telegram.svg';
import { ReactComponent as TwitterIcon } from '../../assets/icons/social/Twitter.svg';
// import { panalytics } from '../../common/analytics';
import { IsCardano } from '../IsCardano/IsCardano';
import { LeaveFeedback } from './LeaveFeedback/LeaveFeedback';

const channels = [
  {
    name: 'twitter',
    url: applicationConfig.social.twitter,
    icon: <TwitterIcon />,
  },
  {
    name: 'telegram',
    url: applicationConfig.social.telegram,
    icon: <TelegramIcon />,
  },
  {
    name: 'discord',
    url: applicationConfig.social.discord,
    icon: <DiscordIcon />,
  },
  {
    name: 'medium',
    url: applicationConfig.social.medium,
    icon: <MediumIcon />,
  },
  {
    name: 'reddit',
    url: applicationConfig.social.reddit,
    icon: <RedditIcon />,
  },
];

const SocialLinks = (): JSX.Element => {
  return (
    <ul className="social-links">
      {channels.map(({ name, url, icon }, index) => {
        return (
          <li key={index} className="social-links__item">
            <a
              className="social-links__link"
              href={url}
              target="_blank"
              rel="noreferrer"
              // onClick={() => {
              //   panalytics.clickSocial(name, 'footer');
              // }}
            >
              {icon}
            </a>
          </li>
        );
      })}
      <IsCardano>
        <li className="social-links__leave-feedback">
          <LeaveFeedback />
        </li>
      </IsCardano>
    </ul>
  );
};

export { SocialLinks };
