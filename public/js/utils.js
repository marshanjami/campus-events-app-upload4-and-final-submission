export function filterEventsByKeyword(events, keyword) {
  if (!keyword) return events;

  return events.filter((e) =>
    e.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function sortEventsByDate(events) {
  return [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

/**
 * Remove events that have already passed
 */
export function removePastEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
}