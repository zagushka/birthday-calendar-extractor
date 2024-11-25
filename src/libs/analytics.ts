const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const MEASUREMENT_ID = 'G-N0LP4JWXT6';
const API_SECRET = 'YW58CFBkQOKEuDCffDQXqw';

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

type SessionData = { timestamp: number; session_id: string };

class Analytics {
  private engagementStart = Date.now();

  constructor(private debug = false) {
    this.debug = debug;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get('clientId') as { clientId: string | undefined };
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  private defaultSessionData(): SessionData {
    return {
      timestamp: Date.now(), // Set timestamp to a past value to force a new session
      session_id: window.crypto.randomUUID(),
    }
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let { sessionData } = await chrome.storage.session.get('sessionData') as {
      sessionData: SessionData | undefined
    };

    if (!sessionData) {
      sessionData = this.defaultSessionData();
    }

    const currentTimeInMs = Date.now();
    // Calculate how long ago the session was last updated
    const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60_000;

    // Check if last update lays past the session expiration threshold
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      // Clear old session id to start a new session
      sessionData = this.defaultSessionData();
    } else {
      // Update timestamp to keep session alive
      sessionData.timestamp = currentTimeInMs;
    }

    await chrome.storage.session.set({ sessionData });

    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  async fireEvent(name: string, params: Record<string, any> = {}) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = Date.now() - this.engagementStart;
    }

    try {
      const client_id = await this.getOrCreateClientId();
      const response = await fetch(
        `${this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id,
            events: [
              {
                name,
                params
              }
            ]
          })
        }
      );
      if (!this.debug) {
        return;
      }
      console.log(await response.text());
    }
    catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // Fire a page view event.
  async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams = {}) {
    return this.fireEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams
    });
  }

  // Fire a click event.
  async fireButtonClickEvent(button_name: string, page_location: string, additionalParams = {}) {
    return this.fireEvent('button_click', {
      button_name,
      page_location,
      ...additionalParams
    });
  }

  // Fire an error event.
  async fireErrorEvent(error: Record<string, any>, additionalParams = {}) {
    // Note: 'error' is a reserved event name and cannot be used
    // see https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
    return this.fireEvent('extension_error', {
      ...error,
      ...additionalParams
    });
  }
}

export default new Analytics();