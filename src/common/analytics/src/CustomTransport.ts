import { BaseTransport } from '@amplitude/analytics-core';
import { Payload, Response, Transport } from '@amplitude/analytics-types';

export enum AppName {
  WEB_APP = 'web_app',
  WEB_SITE = 'web_site',
  DOCS = 'docs',
}

export class CustomTransport extends BaseTransport implements Transport {
  constructor(private appName: AppName) {
    super();

    /* istanbul ignore if */
    if (typeof fetch === 'undefined') {
      throw new Error('FetchTransport is not supported');
    }
  }

  async send(serverUrl: string, payload: Payload): Promise<Response | null> {
    const request: RequestInit = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'x-origin-application': this.appName,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      keepalive: true, // allow the request to outlive the page
    };
    const response = await fetch(serverUrl, request);
    const responseJSON: Record<string, unknown> = await response.json();

    return this.buildResponse(responseJSON);
  }
}
