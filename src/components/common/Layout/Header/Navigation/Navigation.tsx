import { useLocation, useNavigate } from 'react-router-dom';

import { useSelectedNetwork } from '../../../../../gateway/common/network';
import styles from './Navigation.module.less';

type NavigationSectionType = {
  title: string;
  path: string;
};

const navigationSections: NavigationSectionType[] = [
  {
    title: 'Trade',
    path: '/swap',
  },
  { title: 'Liquidity', path: '/liquidity' },
  { title: 'LBE', path: '/lbe' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const [network] = useSelectedNetwork();
  const location = useLocation();

  const handleClickNavigate = (path: string) => {
    navigate(`/${network.name}${path}`);
  };

  return (
    <div className={styles.navigationContainer}>
      {navigationSections.map((section) => (
        <div
          key={section.title}
          className={`${styles.page} ${
            location.pathname === `/${network.name}${section.path}`
              ? styles.active
              : ''
          }`}
          onClick={() => handleClickNavigate(section.path)}
        >
          <p className={styles.name}>{section.title}</p>
        </div>
      ))}
    </div>
  );
}
