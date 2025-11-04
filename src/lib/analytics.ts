// Lightweight client-side analytics helper (local-first)
type EventPayload = {
  name: string;
  properties?: Record<string, any>;
  ts?: string;
};

const ANALYTICS_KEY = 'app_analytics_events';

export function trackEvent(name: string, properties?: Record<string, any>) {
  const ev: EventPayload = { name, properties: properties || {}, ts: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY) || '[]';
    const arr = JSON.parse(raw);
    arr.push(ev);
    // keep only last 500 events
    if (arr.length > 500) arr.splice(0, arr.length - 500);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
  // Also log to console so developers can see events during testing
  // eslint-disable-next-line no-console
  console.debug('[analytics]', ev);
}

export function getEvents() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearEvents() {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {}
}

export default { trackEvent, getEvents, clearEvents };
