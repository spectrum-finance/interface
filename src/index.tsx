// TODO: IMPORT_TO_LESS_DOESNT_WORK
import '@ergolabs/ui-kit/dist/styles/fonts/fonts.less';
import './assets/styles/styles.less';

import React from 'react';
import ReactDOM from 'react-dom';

import { ApplicationInitializer } from './App';
import { reportWebVitals } from './reportWebVitals';

// TODO: fix toggle-group behavior after switch to react v18 root api.
ReactDOM.render(
  <React.StrictMode>
    <ApplicationInitializer />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
