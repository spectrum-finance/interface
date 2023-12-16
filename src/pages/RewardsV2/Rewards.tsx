import { Typography } from '@ergolabs/ui-kit';

import { useSettings } from '../../gateway/settings/settings';

export const Rewards = (): JSX.Element => {
  const { address } = useSettings();
  console.log('address', address);
  return (
    <>
      {address !== undefined ? (
        <>
          <iframe
            frameBorder={0}
            style={{
              width: '100%',
              height: 'calc(100vh - 220px)',
              border: 'none',
            }}
            src={`http://localhost:5265/byAddr/${address}`}
          />
        </>
      ) : (
        <>
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            Please connect your wallet to view your rewards.
          </Typography.Title>
        </>
      )}
    </>
  );
};
