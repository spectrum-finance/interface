import { createContext, useContext } from 'react';

import { isDarkOsTheme } from '../utils/osTheme';

type Theme = 'light' | 'dark';

const defaultTheme: Theme = isDarkOsTheme() ? 'dark' : 'light';

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = (): Theme => useContext(ThemeContext);
