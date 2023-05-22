import './SocialLinks.less';

import { applicationConfig } from '../../applicationConfig';
import { ReactComponent as DiscordIcon } from '../../assets/icons/social/Discord.svg';
import { ReactComponent as MediumIcon } from '../../assets/icons/social/Medium.svg';
import { ReactComponent as RedditIcon } from '../../assets/icons/social/Reddit.svg';
import { ReactComponent as TelegramIcon } from '../../assets/icons/social/Telegram.svg';
import { ReactComponent as TwitterIcon } from '../../assets/icons/social/Twitter.svg';

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
