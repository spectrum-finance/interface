import posthog from 'posthog-js';

const initializePostHog = () => {
  posthog.init('', {
    api_host: '',
    autocapture: true,
  });
};
