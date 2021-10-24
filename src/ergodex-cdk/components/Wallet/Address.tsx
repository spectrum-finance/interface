import './Address.less';

import Icon from '@ant-design/icons';
import React from 'react';

const CopyIconSVG = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2H0.5C0.223437 2 0 2.22344 0 2.5V12C0 12.2766 0.223437 12.5 0.5 12.5H10C10.2766 12.5 10.5 12.2766 10.5 12V2.5C10.5 2.22344 10.2766 2 10 2ZM9.375 11.375H1.125V3.125H9.375V11.375ZM12 0H2.375C2.30625 0 2.25 0.05625 2.25 0.125V1C2.25 1.06875 2.30625 1.125 2.375 1.125H11.375V10.125C11.375 10.1938 11.4313 10.25 11.5 10.25H12.375C12.4438 10.25 12.5 10.1938 12.5 10.125V0.5C12.5 0.223437 12.2766 0 12 0Z"
      fill="currentColor"
    />
  </svg>
);

const ExploreIconSVG = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6667 10.6667H1.33333V1.33333H6V0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V6H10.6667V10.6667ZM7.33333 0V1.33333H9.72667L3.17333 7.88667L4.11333 8.82667L10.6667 2.27333V4.66667H12V0H7.33333Z"
      fill="currentColor"
    />
  </svg>
);

const CopyIcon = () => <Icon component={CopyIconSVG} />;
const ExploreIcon = () => <Icon component={ExploreIconSVG} />;

export const Address: React.FC = () => {
  return (
    <div className="address_wrapper">
      <span>9hK9j1...w3UC</span>
      <CopyIcon />
      <ExploreIcon />
    </div>
  );
};
