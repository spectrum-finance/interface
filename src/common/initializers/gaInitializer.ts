import ReactGA from 'react-ga';
import { of } from 'rxjs';

import { Initializer } from './core';

export const gaInitializer: Initializer = () => {
  ReactGA.initialize('G-JNZLSMXX77');
  ReactGA.pageview(window.location.pathname + window.location.search);
  return of(true);
};
