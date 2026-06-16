const events = [];

export function logEvent(type, payload = {}) {
  const event = {
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
    safetyScope: "lawful defensive education, privacy awareness, business automation, and readiness telemetry"
  };

  events.push(event);
  return event;
}

export function listEvents() {
  return [...events];
}

export function getEventSummary() {
  return events.reduce((summary, event) => {
    summary[event.type] = (summary[event.type] || 0) + 1;
    return summary;
  }, {});
}

export function resetEvents() {
  events.length = 0;
}
