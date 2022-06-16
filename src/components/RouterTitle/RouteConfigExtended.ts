import { RouteObject } from 'react-router/lib/router';

export interface RouteConfigExtended extends Omit<RouteObject, 'children'> {
  title?: string;
  children?: RouteConfigExtended[];
}
